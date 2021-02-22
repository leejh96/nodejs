//mongoose는 mongoDB의 MySQL처럼 들어갈 수 있는 데이터를 제한한다.
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Types: ObjectId} = Schema;
const commentSchema = new Schema({
    commenter: {
        //mongDB는 NoSQL이므로 sequelize처럼 관계를 설정해줄 필욘없다.
        type: ObjectId,
        required: true,
        //어떤 DB의 아이디를 참조할 것인지 설정
        ref: 'User',
    },
    comment:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});
//_id, 작성자, 댓글내용, 생성일
//id는 sequelize랑 같이 선언안해도 알아서 생기지만 id가 아닌 _id로 만들어진다.
module.exports = mongoose.model('Comment', commentSchema);

