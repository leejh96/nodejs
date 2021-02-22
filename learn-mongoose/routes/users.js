var express = require('express');
var router = express.Router();
const User = require('../schemas/user');
/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find()
  .then((users) => {
    res.json(users);
  })
  .catch((error)=>{
    console.error(error);
    next(error);
  })
});

router.post('/', (req, res, next)=>{
  //mongoose에서 새로운 document를 생성하는 법
  //sequelize에서는
  // User.create({
  //   name: '',
  //   age: '',
  // })
  const user = new User({
    //요청으로 온 이름, 나이, 결혼여부 등을 받아서 저장
    name : req.body.name,
    age : req.body.age,
    married: req.body.married,
  });
  user.save()
    .then((result) =>{
      //성공하면 201과 함께 결과를 프론트로 보내줌
      res.status.json(201).json(result);
    })
    .catch((error) =>{
      console.error(error);
      next(error);
    });
});

module.exports = router;
