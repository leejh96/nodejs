const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ColorHash = require('color-hash');//사용자 id를 색깔로 구별
require('dotenv').config();

const webSocket = require('./socket');
const indexRouter = require('./routes');
const connect = require('./schemas');

const app = express();
// /schema/index.js가 실행
connect();

//express에 있는 express-session을 webSocket에도 공유하기 위해서 변수화
//socket.js에서도 사용하기 위함
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8005);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(flash());

//접속하는 사람에게 고유의 컬러를 랜덤으로 만들어주는 커스텀 미들웨어
app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use('/', indexRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

//app을 넘겨주는 이유는 socket.js에서 module.exports = (server, app) 에서 app으로 받는데
//app.set('io',io)로 저장하기 위해
webSocket(server, app, sessionMiddleware);
