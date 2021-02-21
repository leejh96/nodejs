//결과를 저장하다고 있다가 then이나 catch를 사용하여 표현
//콜백함수는 결과를 바로 표현해야하지만 프로미스는 then이나 catch를 사용하기 까지 결과값을 가지고있을 수 있다.
const plus = new Promise((resolve, reject) => {
    const a = 1;
    const b = 2;

    if (a + b < 3){
        resolve(a+b);
    }
    else{
        reject(a-b);
    }
});
//만약 프로미스가 무조건 성공한다면
//const plus = Promise.resolve;
//무조건 실패한다면
//const plus = Promise.reject;
// 로 나타낼 수 있다.


// 결과값이 resolve라면 then에 reject라면 catch에 들어가게된다
plus
    .then((success) => {
        console.log(success);
    })
    .catch((fail) => {
        console.error(fail);
    })

//async await으로 더 간편하게 만들 수 있음