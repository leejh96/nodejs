const SocketIO = require('socket.io');
const axios = require('axios');

//socke.io는 클라이언트를 구분할 수 있음 soket.id

module.exports = (server, app, sessionMiddleware) => {
  //클라이언트가 path로 접근하면 연결됨
  const io = SocketIO(server, { path: '/socket.io' });
  
  //익스프레스 변수 저장 방법(app을 받아온 이유)
  //라우터에서 꺼내 올 때는 req.app.get('io')로 꺼내온다.
  app.set('io', io);

  //네임스페이스
  //실시간 데이터가 전달될 주소를 구별할 수 있다.
  //default는 io.of('/')
  //방 목록 바뀌는 이벤트는 room에 채팅 이벤트는 chat에 모아둔다.
  const room = io.of('/room');
  const chat = io.of('/chat');

  //익스프레스 미들웨어를 소켓io에서 쓰는 법
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  //방의 생성, 삭제를 담당하는 곳
  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  //사용자가 채팅방에 들어오고 나가는 것, 채팅 내용을 담당하는 곳
  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    //요청에 대한 정보는 socket.request에 있다.
    const req = socket.request;
    const { headers: { referer } } = req;
    
    //방 제목 받는 부분
    //req.headers.referer에 웹 주소가 있어서 거기서 방 아이디를 가져온다.
    // /room/roomid
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    //방에 접속
    socket.join(roomId);
    //send 대신 emit사용(키, 값 형태로 보냄)
    //내가 가져온 roomId 에게만 데이터를 보냄
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
      //실시간 접속자 수 전달
      number: socket.adapter.rooms[roomId].length,
    });
    
    //채팅방에서 나갈 시
    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      //방에서 나가기
      socket.leave(roomId);

      //방에 인원이 1명도 없을 경우 방 제거
      //socket.adapter.romms[방아이디]에 현재 방 정보와 인원이 들어있다.
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      //방에 인원이 1명도없다면
      if (userCount === 0) {
        //방을 지울 때 여기에 DB를 조작하지 말고, 라우터를 통해서 조작할 것
        axios.delete(`http://localhost:8005/room/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else { //방에 인원이 1명이라도 있다면
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
          number: socket.adapter.rooms[roomId].length,
        });
      }
    });
  });
};
