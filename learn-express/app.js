var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//app.set은 express 설정 또는 값 저장에 이용
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use는 미들웨어를 장착시킬 때 사용
//use안에 있는 것이 미들웨어이다.
//요청이 오면 미들웨어들을 쭉 지나 소스코드 마지막에 응답이된다.
//밑에 미들웨어들은 use안에 함수에서 이미 next가 존재하여 next를 따로안적어도 된다.

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
