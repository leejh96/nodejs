const http = require('http');
const fs = require('fs');

//DB를 안배웠기 때문에 메모리에 user들을 저장할것
const users = {

};

const router = {
    GET : {
        '/' : (req, res) =>{
            fs. readFileSync('./restAPI/restFront.html', (err, data)=>{
                if (err){
                    throw err;
                }
                res.end(data);
            });
        },
        '/users' : (res, req) => {
            res.end(JSON.stringify(users));
        },
        '*' : (req, res) => {
            return fs. readFile(`.${req.url}`, (err,data)=>{
                return res.end(data);
            });
        },
    },
    POST : {
        '/users' : () =>{
            let body = '';
            req.on('data',(chunk)=>{
                body += chunk;
            });
            req.on('end', () =>{
                console.log('POST 본문 (body)', body);
                const {name} = JSON.parse(body);
                const id = +new Date();
                users[id] = name;
                res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'});
                res.end('사용자 등록 성공');
            });
        },
    },
    PATCH : {
        '/' : () =>{

        },
        '/users' : () =>{
            
        },
    },
    PUT : {
        '/users' : () =>{
            const key = req.url.split('/')[2];
            let body = '';
            req.on('data', (chunk) =>{
                body += chunk;
            });
            return req.on('end', () =>{
                console.log('put',body);
                //id는 /users/!! 느낌표 위치에서 가져올거임
                users[id] = JSON.parse(body).name;
                return res.end(JSON.stringify(users));
            })
        },
    },
    DELETE : {
        '/' : () =>{

        },
        '/users' : () =>{
            const key = req.url.split('/')[2];
            let body = '';
            req.on('data', (chunk) =>{
                body += chunk;
            });
            return req.on('end', () =>{
                console.log('delete',body);
                //id는 /users/!! 느낌표 위치에서 가져올거임
                delete users[id];
                return res.end(JSON.stringify(users));
            })
        },
    }
}

http.createServer((req,res)=>{
    //router 안사용시
    // if (req.method === 'GET'){
    //     if (req.url === '/'){
    //         return fs. readFileSync('./restAPI/restFront.html', (err, data)=>{
    //             if (err){
    //                 throw err;
    //             }
    //             res.end(data);
    //         });
    //     }
    //     else if(req.url === '/users'){
    //         //users는 객체이기 때문에 JSON형식으로 보내줘야함
    //         res.end(JSON.stringify(users));
    //     }
    //     // /와 /users가 아닌 것은 모두 여기로 실행된다.
    //     return fs. readFile(`.${req.url}`, (err,data)=>{
    //         return res.end(data);
    //     });
    // }
    // else if(req.method === 'POST'){
    //     if (req.url === '/'){

    //     }
    //     else if(req.url === '/users'){
    //         //ajax는 스트림형식으로 보내주기때문에 readstream형식으로받아야함
    //         let body = '';
    //         req.on('data',(chunk)=>{
    //             body += chunk;
    //         });
    //         req.on('end', () =>{
    //             console.log('POST 본문 (body)', body);
    //             const {name} = JSON.parse(body);
    //             const id = +new Date();
    //             users[id] = name;
    //             res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'});
    //             res.end('사용자 등록 성공');
    //         });
    //     }
    // }
    // else if(req.method === 'PATCH'){
    //     if (req.url === '/'){

    //     }
    //     else if(req.url === '/users'){
            
    //     }
    // }
    // else if(req.method === 'PUT'){
    //     if (req.url === '/'){

    //     }
    //     //url의 뒷부분이 바뀌기때문에 startWith를 사용
    //     else if(req.url.startsWith('/users')){
    //         // /users/5 이면 0일때 공백 1일때 users 2일때 5이다
    //         const key = req.url.split('/')[2];
    //         let body = '';
    //         req.on('data', (chunk) =>{
    //             body += chunk;
    //         });
    //         return req.on('end', () =>{
    //             console.log('put',body);
    //             //id는 /users/!! 느낌표 위치에서 가져올거임
    //             users[id] = JSON.parse(body).name;
    //             return res.end(JSON.stringify(users));
    //         })
    //     }
    // }
    // else if(req.method === 'DELETE'){
    //     if (req.url === '/'){

    //     }
    //     else if(req.url.startsWith('/users')){
    //         // /users/5 이면 0일때 공백 1일때 users 2일때 5이다
    //         const key = req.url.split('/')[2];
    //         let body = '';
    //         req.on('data', (chunk) =>{
    //             body += chunk;
    //         });
    //         return req.on('end', () =>{
    //             console.log('delete',body);
    //             //id는 /users/!! 느낌표 위치에서 가져올거임
    //             delete users[id];
    //             return res.end(JSON.stringify(users));
    //         })
    //     }
    // }

    //라우터 사용시
    //req.method 는 get, post put delete patch이고
    //req.url 은 /users 같은 url이다.
    const matcheUrl = router[req.method][req.url]
    //matcheUrl이 undefined 일경우 || 뒤에 문장 실행
    (matcheUrl || router[req.method]['*'])(req,res); 

}).listen(8005, () =>{
    console.log('8005번 포트에서 서버 대기중입니다.');
});