const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

//캐슁 하기위한 장소
//const user = {};
//local로그인은 db저장된 이메일과 사용자가 입력한 이메일을 비교하여
//입력한 비밀번호가 옳은지 확인하여 로그인을 시켜주는 로직
//kakao 로그인은 카카오 버튼을 누르면 사용자는 카카오 로그인을 하고
//카카오에서 코드와 정보를 보내주면 카카오에서 인증한 유저이기에 로그인 시켜주는 로직 
module. exports = (passport) =>{
    
    //로그인 시 req.user 값이 session에 저장될 때 실행된다.
    //req.user = {id : 1, name: lee, nick : 26} 이런식이다.
    //유저수가 너무 많아지면 세션에 모든 값을 다 저장하는것은 힘들기 때문에
    //고유값인 id 즉, user.id값만을 저장
    passport.serializeUser((user, done) =>{
        done(null, user.id);
    });
    
    //요청이 실행되다가 app.js에
    //app.use(passport.initialize());
    //app.use(passport.session());
    //이 부분에서 deserializeUser가 실행된다.
    //아까 저장한 id값으로 DB에서 찾아서 완전한 유저정보로 만들고 req.user에 저장됨
    passport.deserializeUser((id, done)=>{
        //deserializeUser는 요청이 올때마다 매번 실행되고 그럼 DB를 매번 참조해야함
        //DB에서 요청하는 것을 줄이기 위해 cahching 하는 것
        //자주 사용하는 것을 캐쉬로 만들어서 사용
        
        // if (user[id]){
        //     //user에 캐쉬하기 위한 id값이 있다면 그 값으로 req.user를 만든다
        //     done(user[id]);
        // }else{
        //     //없다면 DB를 참조해서 id에 해당하는 user데이터를 req.user에 넣는다.
        //     User.findOne({where: {id}})
        //         .then(user => user[id] = user, done(null, user))
        //         .catch(err => done(err));
        // }
        // 위방법이 캐슁이고 로그인하면 안바뀌어서 이거로씀
        User.findOne({ 
            
            where: { id },
            include: [{
                //이 관계는 팔로워를 가져오는 부분
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            },{
                //이관계는 팔로잉을 가져오는 부분
                model: User,
                attributes:['id', 'nick'],
                as: 'Followings'
            }]
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    });
    local(passport);
    kakao(passport);
};