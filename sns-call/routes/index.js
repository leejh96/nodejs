const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:8003'; // origin 헤더 추가

//.env에 있는 CLIENT-SECRET을 sns-api에 보낼 것
// 그 후 인증받아서 jwt토큰을 받아 올 것
// 토큰을 받아오면 유효기간이 만료되기 전까지는 세션에 넣어둘것
const request = async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면
      //sns-api에 CLIENT-SECRET을 넣어 보냄
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      //토큰을 받아오면 세션에 토큰저장
      req.session.jwt = tokenResult.data.token;
    }
    //토큰이 있거나 세션에 저장되어 있다면 요청보내기
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    if (error.response.status === 419) { // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
};

//내 게시글 가져오기
// /mypost에서 요청을 하면 sns-api의 /posts/my로 토큰과 함께 가게 된다.
router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//해시태그 검색
// /search/node 에서요청하면 sns-api의 /post/hashtag/node로 가게된다.
router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      //encodeURIComponent 한글가능하게 하기 위함
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

//팔로우 목록 콜
router.get('/follow', async(req,res,next)=>{
  try {
    const result = await request(req, '/follow');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});




module.exports = router;
