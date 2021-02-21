const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

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
    const cookies = parseCookies(req.headers.cookie);
    //요청주소가 login이라면 if 아니라면 server3.html 보내줌
    if(req.url.startsWith('/login')){
        //만약 '/login?name=aa'라면  url.parse로 name=aa를 가져오고
        //qs.parse를 이용하여 aa를 가져온다
        const {query} = url.parse(req.url);
        const {name} = qs.parse(query);

        //쿠키의 유효시간을 현재시간에 5분을 더한것으로 한다.
        const expires = new Date();
        expires.setMinutes(expires.getMinutes()+5);

        // // {'Set-Cookie': `name =${enccodeURIComponent(name)}; 이부분은 쿠키를 설정하되 name이 특수문자나 한글도 안깨지고 잘 표현해주기위해 사용
        // // Expires=${expires.toGMTString()}; 이부분은 쿠키의 유효시간을 설정
        // // HttpOnly; 자바스크립트에서 쿠키에 접근할수 없다는 것
        // // path=/ 루트 경로에서만 유효한 쿠키
        // res.writeHead(200, {'Set-Cookie': `name =${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; path=/`})
        
        //302는 다른페이지로 보내는 옵션
        res.writeHead(302,{
            Location: '/',
            'Set-Cookie': `name =${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; path=/`
        });
        res.end();
    }
    //저장된 쿠키들을 사용해보는 부분
    else if(cookies.name){
        //{'Content-Type' : 'text/html; charset=utf-8'}이걸 해줘야 한글이 보임
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.end(`${cookies.name}님 안녕하세요`);
    }
    else{
        fs.readFile('./http-module-webserver/server3.html', (err,data)=>{
            res.end(data);
        });
    }
}).listen(8080);

server.on('listening',()=>{
    console.log('8080번 포트에서 서버 대기중');
});
server.on('error', (error)=>{
    console.error(error);
});
