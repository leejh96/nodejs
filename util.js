const util = require('util');
const crypto = require('crypto');

//deprecate는 지원이 조만간 중단될 메서드임을 알려줄 때 사용
const dontuseme = util.deprecate((x,y)=>{
    console.log(x+y);
}, '이 함수는 곧 종료됩니다.');

dontuseme(1,2);


//이 방식은 콜백방식이여서 코드가 길면길수록 점점 깊어진다.
crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt',salt);
    crypto.pbkdf2('바보', salt, 100000, 64, 'sha512', (err,key)=>{
        console.log('passward', key.toString('base64'));
    });
});


//위 방식을 promise방식으로 바꾸면 좋지만 promise를 지원하지 않을 수도 있기때문에 promisify을 사용하여 promise를 가능하게 함
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);
randomBytesPromise(64)
    .then((buf) => {
        const salt = buf.toString('base64');
        return pbkdf2Promise('바보', salt, 100000, 64, 'sha512');
    })
    .then((key)=>{
        console.log('passward', key.toString('base64'));
    })
    .catch((err)=>{
        console.error(err);
    });


//promise방식을 좀더 간단히 만든 것이 async/await

(async() =>{
    const buf = await randomBytesPromise(64);
    const salt = buf.toString('base64');
    const key = await pbkdf2Promise('바보', salt, 100000, 64, 'sha512');
    console.log('passward', key.toString('base64'));
})();