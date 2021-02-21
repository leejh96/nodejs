const crypto = require('crypto');
//열쇠를 알아야 암호화 했다가 복호화가 가능
//암호화
const cipher = crypto.createCipher('aes-256-cbc','열쇠');
//바보가 utf8 문자열이고 그것을 base64 암호화시켜라
let result = cipher.update('바보', 'utf8','base64');
//암호화, 복호화 마무리는 final
result += cipher.final('base64');
console.log('암호',result)



//복호화
//복호화시 암호화 때와 같은 알고리즘과 열쇠를 써야한다.
const decipher = crypto.createDecipher('aes-256-cbc','열쇠');
//base64로 암호화된 result를 utf8로 복호화시켜라
let result2 = decipher.update(result, 'base64','utf8');
result2 += decipher.final('utf8');
console.log('평문', result2)