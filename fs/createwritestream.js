const fs = require('fs');

const writeStream = fs.createWriteStream('./fs/writeme1.txt');

//밑에 write가 다 수행 될경우 수행
writeStream.on('finish', () => {
    console.log('파일 쓰기 완료');
});


//파일에 내가 쓰고자 하는 글을 쓸 때 사용
writeStream.write('이 글을 씁니다.\n');
writeStream.write('한번 더 씁니다.');
//다 쓰면 end
writeStream.end();