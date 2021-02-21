var express = require('express');
var router = express.Router();
const {User} = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  //view에 있는 sequelize 렌더링하게 함
  User.findAll()
    .then((users) => {
      res.render('sequelize', { title: '시퀄라이즈 연습', users: users });
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});

module.exports = router;
