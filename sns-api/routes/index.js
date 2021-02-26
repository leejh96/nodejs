const express = require('express');
const uuidv4 = require('uuid/v4');
const { User, Domain } = require('../models');

const router = express.Router();

router.get('/', (req, res, next) => {
  //메인페이지에 접근하면 사용자를 가져오고 사용자가 등록한 도메인을 가져온다.
  User.find({
    where: { id: req.user && req.user.id || null },
    include: { model: Domain },
  })
  //user에 받아오면 login.pug 렌더링
    .then((user) => {
      res.render('login', {
        user,
        loginError: req.flash('loginError'),
        domains: user && user.domains,
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

//도메인 생성
router.post('/domain', (req, res, next) => {
  Domain.create({
    userId: req.user.id,
    host: req.body.host,
    type: req.body.type,
    //api를 사용하기 위한 비밀키
    clientSecret: uuidv4(),
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;
