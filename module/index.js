const {odd, even} = require('./var.js');
const checkNumber = require('./func');//굳이 .js를 안붙여도됨

function checkStringOddEven(str){
    if (str.length % 2){
        return odd
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddEven('hello'));