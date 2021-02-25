const express = require('express');
const { Post, User } = require('../models');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, isloggedIn} = require('./middlewares');

//프로필 페이지
router.get('/profile',isLoggedIn,(req, res)=>{
    res.render('profile', {title : '내 정보 - SNS', user: req.user});
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
    Post.findAll({
        //include 로 게시글 작성자와 게시글을 연결
        include : [{
            model: User,
            attributes: ['id','nick'],
        },{
            model: User,
            attributes:['id', 'nick'],
            as: 'Liker'
        }]
    })
    .then((posts) => {
        res.render('main',{
            title : 'SNS',
            //유저의 아이디와 닉네임을 게시글들과 같이 렌더링한다.
            twits: posts,
            user: req.user,
            loginError: req.flash('logindError')
        });
    })
    .catch((err)=>{
        console.error(err);
        next(err);
    });
});

module.exports = router;