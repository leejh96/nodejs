const KakaoStrategy = require('passport-kakao').Strategy;

const {User} = require('../models');

module.exports =(passport) => {
    passport.use(new KakaoStrategy({
        //clientID : developes.kakao.com에서 만든 카카오 앱 아이디
        //callbackURL : 카카오 리다이렉트 주소
        //즉 /auth/kakao로 인증을 보내게 되면 카카오에서 인증을 해주면
        //응답이 callbackURL로 돌아온다.
        //그 응답을 KakaoStrategy가 분석하여 acessToken, refreshToken, profile이 만들어진다. 
        clientID: process.env.KAKAO_ID,
        callbackURL:'/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) =>{
        //sns 기반 로그인은 토큰 기반으로 로그인을 하게 되는게 일반적이다.
        //즉 회원가입이 없고 해당 sns에서 인증이 될 시 그 사용자가 DB에 없다면 저장
        //혹은 DB에 있다면 그 데이터를 사용하는 것만 있다. 
        //profile에는 카카오로 로그인한 각종 정보가 들어있다. dmail, nick, snsid 등등
        try{
            //기존에 카카오로 가입한 유저가 있는지 확인
            const exUser = await User.findOne({
                where:{
                    snsId: profile.id,
                    provider: 'kakao'
                }
            });
            //DB에 카카오로 가입한 유저가 있다면
            if (exUser){
                done(null, exUser);
            } else{
                //DB에 카카오로 가입한 유저가 없다면
                //해당유저를 DB에 저장
                const newUser = await User.create({
                    //profile._json 이런 값은 카카오가 정해둔 것이기때문에 그대로 써야한다.
                    email: profile._json && profile._json.kakao_account.email,
                    nick: profile._json.kakao_account.profile.nickname,
                    snsId:profile.id,
                    provider:'kakao'
                });
                done(null, newUser);
            }
        }catch(err){
            console.error(err);
            done(err);
        }
    }))
};