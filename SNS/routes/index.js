const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, isloggedIn} = require('./middlewares');
//프로필 페이지
router.get('/profile',isLoggedIn,(req, res)=>{
    res.render('profile', {title : '내 정보 - SNS', user: null});
});
//회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res)=>{
    res.render('join',{
        title : '회원가입 - SNS',
        user: req.user,
        joinError: req.flash('joinError')
    });
});
//메인페이지
router.get('/',(req, res, next)=>{
    res.render('main',{
        title : 'SNS',
        twits: [],
        user: req.user,
        loginError: req.flash('logindError')
    });
});

module.exports = router;