const mongoose = require('mongoose');

module.exports = () =>{
    const connect = ()=>{
        //'mongodb://db아이디:db비번@localhost:27017/admin(admin으로해야 로그인가능)'
        //이 프로젝트에선 admin DB가 아닌 nodejs DB를 쓰기때문에 {}를 나눠서 만들어줌
        mongoose.connect('mongodb://root:@localhost:27017/admin', {
            dbName: 'nodejs',
        }, (error) =>{
            if (error){
                console.log('몽고디비 연결 에러', error);
            } else{
                console.log('몽고디비 연결 성공');
            }
        });
    }

    mongoose.connection.on('disconnected', (error)=>{
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.');
        connect()
    });

    //DB연결 후 몽구스 스키마들을 불러옴
    require('/user');
    require('/comment')
};