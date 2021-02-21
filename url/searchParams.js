const {URL} = require('url');

const myURL = new URL('https://www.naver.com/login?id=이주혁');
console.log('searchParams : ', myURL.searchParams);

console.log(myURL.searchParams.get('id'));
//searchParams의 각종 메서드로 key값, value값 등을 가져올 수 있다.