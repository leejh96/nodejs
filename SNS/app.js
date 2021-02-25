const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config(); // .env파일의 값이 process.env에 들어감
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const passport = require('passport');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const app = express();
sequelize.sync()
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
//이미지를 가져오기위한 정적파일
//실세 경로는 uploads이지만 프론트에서 불러오기 위해서는 /img/파일이름 이런식으로
//가져와야 한다. 보안을 위함
app.use('/img',express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized: false,
    secret: 'SNSsecret',
    cookie:{
        httpOnly:true,
        secret: false,
    },
}));
//일회성 메시지
//새로고침하면 없어지는 메시지
app.use(flash());

//passport 설정 초기화
app.use(passport.initialize());
//localStategy로 로그인 시 사용자 정보를 세션에 저장
//항상 express session보다는 아래에 있어야 함 (28줄)
//express session이 만든 세션을 passport.session이 사용한다.
app.use(passport.session());

app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use((req, res, next)=>{
    const err = new Error('NotFound');
    err.status = 404;
    next(err);
});
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err: {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () =>{
    console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
});