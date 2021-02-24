const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const {User} = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');

//router.get('/join', isNotLoggedIn, async(req, res, next) =>{})
//이런식으로 존재할 때 라우터는 미들웨어를 하나씩 실행시키므로
//isNotLoggedIn이 실행된 후 async(req, res, next)=>{}가 실행된다.
//로그인 한사람은 회원가입을 할 필요가 없기 때문에 isNotLoggedIn을 넣는다.
router.post('/join', isNotLoggedIn, async (req, res, next)=>{
    //회원가입을 누르면 이메일 , 닉네임, 비밀번호를 생성하는 창이 생기고
    //입력 값이 req.body를 통해 온 뒤 각각 email, nick, password에 저장
    const {email, nick ,password } = req.body;
    try{
        //User DB에서 전달된 email과 같은 값이 있는지 확인
        const exUser = await User.findOne({ where: { email } });
        if (exUser){
            //일회성 메시지
            req.flash('joinError', '이미 가입된 이메일입니다.');
            //join페이지로 다시 돌아가는 부분
            return res.redirect('/join');
        }
        //bcrypt로 암호화 하는 방법
        //12 값은 커질수록 암호화가 잘되지만 속도가 느려진다.
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
        
    }catch(err){
        console.error(err);
        return next(err);
    }
});

//로컬 로그인 시
router.post('/login', isNotLoggedIn, (req, res, next)=>{//req.body.email, req.body.password
    //done에 값이 콜백함수에 들어옴
    //done(에러 => authError, 성공 => user, 실패 => info)
    passport.authenticate('local', (authError, user, info) =>{
        if(authError){
            //이메일이 없을 경우
            console.error(authError);
            return next(authError);
        }
        else if (!user){
            // 비밀번호가 틀렸을 경우
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        //성공
        //사용자 정보 받아서 로그인 하는 부분
        //세션에 로그인 정보가 저장됨 req.user에서 찾을 수 있음
        return req.login(user, (loginError)=>{
            //req.user를 세션에 저장
            //운이없으면 여기서 err가 생길 수 있음
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/')
        });
    })(req, res, next);// 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

router.get('/logout', isLoggedIn, (req, res)=>{
    //passport가 지원하는 logout()실행,
    //req.user의 값을 지워주는지 확신을 할 수 없음
    //따라서 session도 지움
    req.logout();
    //세션도 지워버림
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;