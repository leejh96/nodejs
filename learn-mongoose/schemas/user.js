//mongoose는 mongoDB의 MySQL처럼 들어갈 수 있는 데이터를 제한한다.
const mongoose = require('mongoose');
const {Schema} = mongoose;
const userSchema = new Schema({
    name:{
        type: String,
        //null 여부로 필수로 넣어야하면 true, 아니라면 false
        required: true,
        unique: true,
    },
    age:{
        type: Number,
        required: true,
    },
    married:{
        type: Boolean,
        required: true,  
    },
    comment:{
        type : String,
    },
    createdAt:{
        type: Date,
        defalut: Date.now,
    },
});
//_id 이름 나이 결혼여부 자기소개 생성일
//id는 sequelize랑 같이 선언안해도 알아서 생기지만 id가 아닌 _id로 만들어진다.
module.exports = mongoose.model('User', userSchema);

