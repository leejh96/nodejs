const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//view엔진으로 퍼그를 쓰고 그 파일은 views에 있다는 것을 알려줌
//view엔진으로는 ejs, pug, jade 등이 존재
//set한 값은 app.get('view engine')하면 jade가 나온다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//express.~는 express 자체 미들웨어이고 아닌것은 다른 사용자가 만든 미들웨이이다
//logger 미들웨어는 get, post ,delete와 같은 라우터 미들웨어를 만날 경우
//무슨요청이 왔고 어떤 응답을 했는지 기록해준다.
//로깅을 하겠다고 생각을 해두고 라우터 미들웨어를 만나면 그 때실행
//따라서 맨 위에 선언해둬도 밑에 라우터 미들웨어를 만날 때 까지 유효
//미들웨어의 순서도 중요하다.
//한개의 미들웨어에는 여러개의 미들웨어를 한번에 쓸 수 있다.
//ex) app.use(logger('dev'),logger('dev'),express.json(),express.urlencoded({ extended: false }));
//보기 나빠서 하나씩 쓰는 것
app.use(logger('dev'));

//req.on('data'), req.on('end') 과 같은 역할 restSever.js 참고
//app.use((req, res, next)=>{
//    express.json()(req,res,next);    
//});
//위와 밑은 같은것임
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//parseCookies함수(cookie.js 볼 것)와 유사한 것으로 쿠키를 파싱해주는 미들웨어
//쿠키가 클라이언트에 저장되는데 그 쿠키가 서버가 저장하라한 쿠키인지 위조된 쿠키인지
//확인하기 위한 비밀키를 cookieParser 안에 값으로 넣는다.
app.use(cookieParser('secret code'));

//public 폴더에 있는 정적파일들을 가져오는 미들웨어
app.use(express.static(path.join(__dirname, 'public')));

//메모리 세션을 활성화 하기위한 미들웨어
//이 구조를 외워둘것
//secret값은 cookieParser 미들웨어에 값으로 넣어줄 것
app.use(session({
    resave : false, //true라면 요청이 올때마다 session객체에 수정사항이 없더라도 계속 업데이트
    saveUninitialized: false,//true 라면 session을 계속 업데이트
    secret: 'secret code',
    cookie:{
        httpOnly:true,
        secure:false,//https를 쓸지선택
    },
}));

//로그인이 실패했을 때 팝업 메시지를 뜨게 해주는 미들웨어
app.use(flash());


//미들웨어 설정(use뿐만 아니라 get post delete등도 일종의 미들웨어)
//미들웨어는 어떠한 요청이 있을 때 요청을 미들웨어에서 처리하여 결과를 반환하는 것이다.
//use는 모든 경우에, get post delete등은 특정한 경우에 적용되는 미들웨어이다.
//첫번째 미들웨어에서 두번째 미들웨어로 넘어가기 위해서는 next를 호출해야한다.
app.use((req, res, next)=>{
    console.log('첫 번째 미들웨어');
    next();
//이런식으로 아래 use와 합치는 것도 가능
}/*,(req, res, next)=>{
//     console.log('두 번째 미들웨어');
//     next();
}*/);
//여기에서 next를 호출안해주면 그 밑에 get, post, delete가 호출되지 않는다.
app.use((req, res, next)=>{
    console.log('두 번째 미들웨어');
    next();
});

//아래와 같은 라우터 미들웨어는 해당 이벤트랑 일치하는 경우에만 실해되고
//use와 같은 공통 미들웨어는 요청이 온다면 무조건 실행하게 된다.
// 라우터 미들웨어들은 indexRouter 변수를 이용해 routes 폴더에서 가져올것
// app.js가 너무 길어지는 것을 방지하기 위해서
// app.get('/', (req, res) => {
//     //http에선 res.end를 사용했지만 express에선 send를 사용
//     res.send('hello express');
// });
// app.get('/user', (req, res)=>{
//     res.send('hello user');
// })

// app.post('/', (req,res)=>{

// });

// app.delete('/', (req, res)=>{

// });

// 여기서 /는 routes에 있는 라우터 미들웨어에 url과 합쳐저서
// //, //user 이런식으로 되는데 //는 /와 같은 의미이다.
app.use('/', indexRouter);

// url이 /users/ 이런식으로 바뀐다
app.use('/users', usersRouter);

//모든 라우터를 다 지나도 해당되는 것이 없을 때 사용, 페이지가 없는 경우
app.use((req, res, next)=>{
    //express에선 writeHead대신 status 사용
    res.status(404).send('NOT FOUND');
});

//서버에서 발생하는 에러(DB 등)를 처리하는 부분
//next(error)이런식으로 넘어오면 다른 미들웨어 전부 건너뛰고 에러를 처리하기위해 온다
app.use((err, req, res, next) => {
    
    res.locals.message = err.message;
    //req.app.get은 routes에서는 app이 없기때문에
    //req.app을 사용하면 app.get처럼 사용할 수 있다.
    //대신 이것은 전역변수마냥 모두가 공유가능하기 때문에
    //특정한 요청에서만 사용할 때는 req.password = '이주혁' 이런식으로 저장
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    console.error(err);
    res.status(500).send('SERVER ERROR');
});
module.exports = app;

//res.render views 폴더에 있는 ejs, pug, jade 등등 파일을 불러올 때 사용
//res.send 글자표현에 사용
//res.sendFile html문서라던가 파일을 불러올때사용
//res.json 데이터를 주고받을때사용(api요청시)