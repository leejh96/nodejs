#!/usr/bin/env node
// => 윈도우에서는 그냥 주석이지만 리눅스나 맥에서는 node프로그램이 있는 경로여서
//저 위치의 노드로 node를 돌려라 라는 명령어
const readline = require('readline');

const rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout,
});

console.clear();
const answerCallback =  (answer) =>{
    if (answer === 'y'){
        console.log('맞습니다.');
        rl.close();
    }
    else if (answer === 'n'){
        console.log('아닙니다.');
    }
    else{
        console.log('y 또는 n만 입력하세요');
        rl.question('예제입니까 (y/n)', answerCallback)
    }
}
rl.question('예제 입니까 (y/n)',answerCallback)