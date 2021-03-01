//채팅 저장 스키마
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
  room: {
    //채팅방
    type: ObjectId,
    required: true,
    ref: 'Room',
  },
  user: {
    //사용자
    type: String,
    required: true,
  },
  //채팅내용
  chat: String,
  //gif
  gif: String,
  createdAt: {
    //생성일
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
