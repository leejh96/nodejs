const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter, freeApiLimiter, PremiumApiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

//미들웨어 커스터마이징, cors미들웨어를 바꿔주기 위해
router.use(async (req, res, next) => {
  const domain = await Domain.find({
    where: { host: url.parse(req.get('origin')).host },
  });
  //도메인이 등록되어 있다면
  if (domain) {
    //CORS 오류를 해결하기 위해 Access-Control-Allow-Origin 헤더를 넣어줌
    cors({ origin: req.get('origin') })(req, res, next);
  } else {
    next();
  }
});
router.use(async (req, res, next)=>{
  const domain = await Domain.find({
    where: { host: url.parse(req.get('origin')).host },
  });
  //free 라면,
  if (domain.type === 'free') {
    freeApiLimiter(req, res, next);
    
    //premium 이라면
  } else {
    PremiumApiLimiter(req, res, next);
  }
});
router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.find({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.user.id,
      nick: domain.user.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.find({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

//팔로워, 팔로잉 가져오기
router.get('/follow', verifyToken, async (req, res) => {
  try {
    const user = await User.find({
      where : {
        id : req.decoded.id
      }
    });
    const follower = await user.getFollowers({ attribute: ['id', 'nick']});
    const following = await user.getFollowings({ attribute: ['id', 'nick']});
    return res.json({
      code: 200,
      follower,
      following
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code : 500,
      message: "서버에러"
    });
  }
});

module.exports = router;
