const url = require('url');
const querystring = require('querystring');

const parseUrl = url.parse('https://www.naver.com');
const query = querystring.parse(parseUrl.query);

console.log('querystring.parse() : ',query)
//searchParams와 유사한 기능
//즉 url을 부분부분 나눠주는 것이 querystring 및 searchParams이고 그것을 다시붙여서 하나의 문자로 만들수도있다.
//searchParams에서는 toString querystring에서는 stringify