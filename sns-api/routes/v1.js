const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

//새로운 버전이 나와서 못쓰게하기 위함
router.use(deprecated);

//사용자가 비밀키를 넣어서 토큰 발급을 할 경우
//토큰에는 민감한 정보는 넣지 않아야한다. 그 내용을 볼 수 있기때문에
//하지만 절대 내용을 변조시킬 수 없다는 장점이 있다.
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
        //api서버의 응답은 형식이 하나로 통일해주는 것이 좋다 (Ex JSON)
        //따라서 에러 코드도 next가 아닌 message를 넣어 JSON으로 만들어준다. 
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    //jwt.sign으로 토큰을 발급할 수 있다.
    const token = jwt.sign({
      id: domain.user.id,
      nick: domain.user.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '1m', // 옵션으로 유효기간 1분
      issuer: 'nodebird',
    });
    return res.json({
      //code 값을 임의로 줘서 무슨 에러가 생겼는지 확인할 수도 있다.
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

//내가 쓴 게시글만 가져오는 부분
router.get('/posts/my', verifyToken, (req, res) => {
  //토큰검사 후 실행
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

//해시태그를 검색한 게시글 가져오는 부분
router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.find({ where: { title: req.params.title } });
    //검색결과가 없으면
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    //있으면 연관된 게시물을 리턴
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
    const user = await User.findOne({
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
