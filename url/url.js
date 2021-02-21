const url = require('url');
//WHATWG방식
const URL = url.URL;
const myURL = new URL('https://www.naver.com');

console.log(myURL);
console.log('--------------------------')


//기존방식
const parseUrl = url.parse('https://www.naver.com')
console.log(parseUrl)