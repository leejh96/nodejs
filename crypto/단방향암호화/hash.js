const crypto = require('crypto');
//sha512는 암호화 알고리즘이며, update부분에 암호화하고자 하는 비밀번호를 넣고 digest부분에는 어떤방식으로 출력할지를 설정
//해쉬를 이용하여 암호화하면 복호화 하는것이 불가능하다. 이러한 방식을 단방향 암호화이다.
console.log(crypto.createHash('sha512').update('비밀번호').digest('base64'));
