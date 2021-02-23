const express = require('express');
const router = express.Router();
//프로필 페이지
router.get('/profile',(req, res)=>{
    res.render('profile', {title : '내 정보 - SNS', user: null});
});
//회원가입 페이지
router.get('/join',(req, res)=>{
    res.render('join',{
        title : '회원가입 - SNS',
        user: null,
        joinError: req.flash('joinError')
    });
});
//메인페이지
router.get('/',(req, res, next)=>{
    res.render('main',{
        title : 'SNS',
        twits: [],
        user: null,
        loginError: req.flash('logindError')
    });
});

module.exports = router;