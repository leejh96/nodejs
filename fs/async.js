const fs = require('fs');


// //비동기 이기에 실행할때마다 순서가 달라진다.
// console.log('시작');
// fs.readFile('./fs/readme.txt',(err,data)=>{
//     if(err){
//         throw err;
//     }
//     console.log('1번',data.toString()); 
// });
// fs.readFile('./fs/readme.txt',(err,data)=>{
//     if(err){
//         throw err;
//     }
//     console.log('2번',data.toString()); 

// });
// fs.readFile('./fs/readme.txt',(err,data)=>{
//     if(err){
//         throw err;
//     }
//     console.log('3번',data.toString()); 
// });
// console.log('끝');
//동기화 시키고 싶다면 콜백함수로 만들거나 readFileSync를 사용한다.
let data = fs.readFileSync('./fs/readme.txt');
console.log('시작');
console.log('1번',data.toString()); 
data = fs.readFileSync('./fs/readme.txt');
console.log('2번',data.toString()); 
data = fs.readFileSync('./fs/readme.txt');
console.log('3번',data.toString()); 
console.log('끝');