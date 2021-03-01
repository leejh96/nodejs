const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

//방 목록 라우터
router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError') });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//방 생성 화면 라우터
router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

//방 생성 라우터
router.post('/room', async (req, res, next) => {
  try {
    const room = new Room({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const newRoom = await room.save();
    //socket에서 app.set('io',io)한 것 가져오는 부분
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//방 입장 라우터
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    //없는 방에 입장하면
    if (!room) {
      req.flash('roomError', '존재하지 않는 방입니다.');
      return res.redirect('/');
    }
    //방에 비밀번호가 존재하고, 비밀번호를 틀렸을경우
    if (room.password && room.password !== req.query.password) {
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/');
    }
    //방에 허용인원이 초과되었을 경우
    const { rooms } = io.of('/chat').adapter;
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      req.flash('roomError', '허용 인원이 초과하였습니다.');
      return res.redirect('/');
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');
    //만약 다 통과했다면
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      //방에 참여 인원수
      //방에 들어가는 사람은 인식하지 못하여 들어가기 전에 있던 사람의 수만 세기 때문에 1을 더해줌
      number: (rooms && rooms[req.params.id]&& rooms[req.params.id].length+1)|| 1,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//방을 지우는 라우터
router.delete('/room/:id', async (req, res, next) => {
  try {
    //방과 채팅을 다 지움
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    //2초정도 뒤에 이방이 지워졌다는 것을 모든 사람에게 알림
    setTimeout(() => {
      //방을 지웠으므로 방이 지워진 이벤트(removeRoom)를 id값과 함께 보내준다.
      //다른 사람이 보는 방목록에서 이 방이 지워짐
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    await chat.save();
    //emit('chat')하면 프론트에서 chat.pug on('chat')으로 받음
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//업로드 폴더가 없으면 생성
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});
//chat.pug에서 선택한 gif파일을 저장하는 변수
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// gif파일 db에저장하고 보여주는 부분
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    await chat.save();
    //채팅방에 보여주는 부분
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
