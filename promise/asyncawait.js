// User.findOne('zero')
//     .then((user) =>{
//         console.log(user);
//         return User.update('zero','nero')
//     })
//     .then((updatedUser) =>{
//         console.log(updatedUser);
//         return User.remove('nero');
//     })
//     .then((removedUser) =>{
//         console.log(removedUser);
//     })
//     .catch((err) => {
//         console.error(err);
//     })
// console.log('다 찾았니');

//위와 아래가 같은 코드, 아래가 async/await을 이용 위는 프로미스 사용
//findone, update, remove는 이해를 돕기위한 가상의 코드 따라서 실행안댐
async() => {
    const user = await Users.findOne('zero');
    const updatedUser = await Users.update('zero','nero');
    const removedUser = await Users.remove('nero');

    console.log('다 찾았니');
}

