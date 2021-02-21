//변수를 var.js에서 불러와서 사용
const { odd, even } = require('./var.js');
function checkOddEven(num){
    if(num % 2){
        return odd;
    }
    return even;
}

module.exports = checkOddEven;








// //옛날 문법
// const variable = require('./var.js');
// console.log(variable)
// console.log(variable.odd);
// console.log(variable.even);