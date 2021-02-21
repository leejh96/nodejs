const fs = require('fs');

const readStream = fs.createReadStream('./fs/readme.txt');
const writeStream = fs.createWriteStream('./fs/writeme.txt');
//readme.txt를 읽어서 writeme.txt에 쓰기, .pipe()는 여러개 이어서 사용가능
readStream.pipe(writeStream);


////위와 같은방법
// const readStream = fs.copyFile('./fs/readme.txt','./fs/writeme.txt', (err) =>{
//     console.log(err);
// });