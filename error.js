//권장하지 않는 방법
// setInterval(() => {
//     console.log('시작');
//     try{
//         throw new Error('서버를 고장내주마') ;
//     }
//     catch(error){
//         console.error(error);
//     }
// }, 1000);


// //비동기 메서드들은 콜백함수에서 err가 들어오기 때문에 에러가 나도 프로그램이 멈추진않음
// const fs = require("fs");
// setInterval(() => {
//     fs.unlink('./asdfasd.js', (err)=>{
//         if(err){
//             console.log('시작');
//             console.log(err);
//             console.log('끝')
//         }
//     })
// }, 1000);


//try-catch안쓰고 에러잡는 방법
//uncaughtException은 처리못한 예외를 한꺼번에 모아서 처리하는 것
//모든 에러는 잡지만 처리하지 않기때문에 에러가나면 그 위치에 수정을 할것
process.on('uncaughtException', (err)=>{
    console.error('예기치 못한 에러', err);
    //이곳에 서버를 복구하는 코드를 넣는것을 별로 추천x
    //uncaughtException이 콜백을 실행하는 것을 보장하진 않는다.
});
setInterval(() => {
    throw new Error('서버를 고장내주마');
}, 1000);

setTimeout(() => {
    console.log('시작');
}, 2000);