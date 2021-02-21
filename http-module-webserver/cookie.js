const http = require('http');
const fs = require('fs');

//그냥 쿠키를 parse하는 부분으로 생각하지 말것
const parseCookies = (cookie = '')=>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k,v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

const server = http.createServer((req, res)=>{
    //쿠키 접근법
    //클라이언트에서 서버로 쿠키를 보내는 것
    //req.url은 어디에서 요청이 들어왔는지 확인하는 것
    console.log(req.url,req.headers.cookie);
    
    //쿠키를 헤더에 넣는 법
    //200은 html응답코드로 성공한 응답요청이다.
    //실패한다면 400번대가 나온다.
    //{'Set-Cookie': 'mycookie=test'}는 쿠키설정이고
    // mycookie 는 key, test는 value이다.
    //서버에서 클라이언트로 쿠키를 보내는 것
    res.writeHead(200, {'Set-Cookie': 'mycookie=test'});
    res.end('Hello cookie');
}).listen(8080);

server.on('listening',()=>{
    console.log('8080번 포트에서 서버 대기중');
});
server.on('error', (error)=>{
    console.error(error);
});

//개발자도구에서 network에서 localhost를 클릭해보면 request.headers에
//cookie부분이 mycookie=test인것을 볼수있다.
//또한 application에서 cookie를 볼 수 있다.