var express = require('express');
var router = express.Router();

// DB안에 있는 값을 비구조화 할당으로 가져옴
var {User} = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //users DB에서 데이터를 모두 가져옴
  //findAll은 DB에서 모두 가져오고, find는 하나만, create는 생성이다.
  User.findAll()
    .then((users) => {
      //DB에서 가져온 값이 자바스크립트 객체(배열)로 담기기 때문에 json으로 응답
      res.json(users);
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    })
});

router.post('/', (req, res, next) => {
  User.create({
    name: '',
    age: '',
  })
    .then((result)=>{
      console.log(result);
      //상태코드를 201로하고 성고한 결과인result값을 클라이언트로 보내줌
      res.status(201).json(result);
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});

module.exports = router;
