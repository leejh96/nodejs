const http = require('http');
const fs = require('fs');
//http의 이벤트리스너는 이벤트 명은 적어주지않아도 된다.
// 디폴트로 설정되어 있기 때문에 콜백함수만 적어주면 된다.
//req 요청(방문요청), res(응답의 종류(수락,거절))
const server = http.createServer((req, res)=>{
    console.log('서버실행');
    //write는 html을 한줄씩 적어서 보내줌
    //end는 더이상 write할 것이 없다는 것을 브라우저에게 알려줌

    // res.write('<h1>Hello Node!</h1>');
    // res.write('<h2>Hello JS!</h2>');
    fs.readFile('./http-module-webserver/server2.html',(err, data)=>{
        if(err){
            throw err;
        }
        //data를 toString안하는 이유는 브라우저가 알아서 해준다.
        res.end(data);
    });
//listen(8080,())은 열고자하는 포트번호를 의미
//http의 기본포트는 80, 기본포트는 도메인적을 때 포트번호 생략이 가능하다
//https의 기본포트는 443, 생략가능
//프로그래밍을 할땐 8080을 자주씀
}).listen(8080);

//listen에 이벤트리스너를 따로뺌
server.on('listening',()=>{
    console.log('8080번 포트에서 서버 대기중');
});
server.on('error', (error)=>{
    console.error(error);
});