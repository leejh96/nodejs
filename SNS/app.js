const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config(); // .env파일의 값이 process.env에 들어감
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');

const app = express();
sequelize.sync()

app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use(flash())

app.use('/',indexRouter);

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