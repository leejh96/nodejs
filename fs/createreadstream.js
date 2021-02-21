const fs = require('fs');

//highWaterMark값은 몇바이트씩 읽을지를 정하는 것
const readStream = fs.createReadStream('./fs/readme.txt',{highWaterMark: 16});
const data = [];

//chunk가 16바이트씩 보내지는 데이터로 16바이트 데이터가 보내질 때마다 data이벤트가 발생한다.
readStream.on('data', (chunk)=>{
    data.push(chunk);
    console.log('data', chunk, chunk.length);
});

readStream.on('end', ()=>{
    //나눠서 보낸 데이터들을 concat로 합치고 문자열화 한다.
    console.log('end\n', Buffer.concat(data).toString());
});

readStream.on('error', (err)=>{
    console.log('error', err);
});