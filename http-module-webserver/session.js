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


//메모리 세션
//쿠키를 통해 개인정보가 유출되는 것을 막기위해 사용
//key값을 session으로 value값을 랜덤넘버로 표현 => 개발자도구로 확인
const session = {

};
const server = http.createServer((req, res)=>{
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')){
        const {query} = url.parse(req.url);
        const {name} = qs.parse(query);
        const randomInt = +new Date();
        const expires = new Date();
        expires.setMinutes(expires.getMinutes()+5);
        //세션객체에 개인정보를 넣어서 보호
        session[randomInt] = {
            name,
            expires,
        };
        res.writeHead(302,{
            Location: '/',
            //쿠키의 이름을 session 값은 randomInt값으로 변경
            'Set-Cookie': `session=${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; path=/`
        });
        res.end();
    }
    //cookies.session(=cookie의 value 여기서는 randomInt)이 존재하고
    //유효기간이 안지났을 경우에는 수행
    else if(cookies.session && session[cookies.session].expires > new Date()){
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.end(`${session[cookies.session].name}님 안녕하세요`);
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
