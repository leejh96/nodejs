//passport가 req.login, req.logout, req.isAuthenticated 등등 추가해줌
//로그인 여부를 묻는 미들웨어, 직접 만들어준 것

exports.isLoggedIn = (req, res, next)=>{ 
    //로그인 여부를 알려줌
    if( req.isAuthenticated()){
        //안에 오류를 넣어준게 아니므로 그냥 넘어가는 것
        next();
    } else{
        res.status(403).send('로그인필요');
    }
};

exports.isNotLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
};