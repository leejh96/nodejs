//pbkdf2는 hash와 마찬가지인 암호화 알고리즘인데 hash보다 더 복잡한 알고리즘
const crypto = require('crypto');

//랜덤한 64바이트를 만들고 buf에 담고 그 바이트를 base64(buf를 문자열로 만드는 알고리즘 중 하나) 문자열로 만든다.
crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt',salt);

    //crypto.pbkdf2('비밀번호', 비밀번호에 추가되는 내용, 숫자는 높을수록 좋지만 시간이 오래걸림, 64바이트 암호문으로 만들겠다, 알고리즘 종류)
    crypto.pbkdf2('바보', salt, 100000, 64, 'sha512', (err,key)=>{
        console.log('passward', key.toString('base64'));
    });
});