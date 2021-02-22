var express = require('express');
var router = express.Router();
//mongoose는 model을 스키마에서 직접 가져옴
const User = require('../schemas/user')
/* GET home page. */
router.get('/', function(req, res, next) {
  //find : 모두찾기 , findOne : 하나만 찾기, new 스키마.save : 생성
  //update : 수정하기, remove : 제거하기
  User.find()
    .then((users) => {
      res.render('mongoose', {title: 'Express', users});_
    })
    .catch((error)=>{
      console.error(error);
      next(error);
    })
  res.render('mongoose', { title: 'Express', users: [] });
});

module.exports = router;
