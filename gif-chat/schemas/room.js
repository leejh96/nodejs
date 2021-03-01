const mongoose = require('mongoose');
//mongoDB의 스키마가 mysql의 테이블
const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {
    //방제목
    type: String,
    required: true,
  },
  max: {
    //최대 허용인원
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  owner: {
    //방장
    type: String,
    required: true,
  },
  //비밀번호 방, 필수는 아님
  password: String,
  createdAt: {
    //생성일
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);
