//app.js에서 쓸 수 있지만 너무 길어지기 때문에 따로 만들어서 require함
const WebSocket = require('ws');

//server는 app.js에서 listen 한 것을 server변수에 저장해둠
//http와 ws는 포트를 공유하기 때문에 server변수가 포트를 연결했기 때문에
// 따로 포트 연결을 할 필요가 없음
// ex http: http://abc.com:8005, ws : ws://abc.com:8005, 만약 https라면 wss
module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    //req를 통해 접속자의 ip를 알수있음 보통 req.connection.remoteAddress 이거에있음
    //req.headers['x-forwarded-for'] =>프록시 서버를 대비한 방법
    //프록시 서버는 중계서버로, 클라이언트에서 서버로 요청을 보낼때 가운데에 서버를
    //하나 더 껴서 3단,4단구조가 되면 ip가 바뀌기 때문에 저런식으로 표현 
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속', ip);
    //클라이언트에서 서버로 메시지를 보내는 것
    ws.on('message', (message) => {
      console.log(message);
    });
    ws.on('error', (error) => {
      console.error(error);
    });
    ws.on('close', () => {
      console.log('클라이언트 접속 해제', ip);
      //클라이언트가 종료되면 서버에서 클라이언트로 보내는 interval도 없애기 위해
      //안한다면 메모리 누수가 생긴다.
      clearInterval(ws.interval);
    });
    //3초마다 서버에서 클라이언트에 메시지를 보내는 부분
    const interval = setInterval(() => {
        //CONNECTING : 연결중
        //OPEN : 연결
        //CLOSING : 종료 중
        //CLOSED : 종료
      if (ws.readyState === ws.OPEN) {
        ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
      }
    }, 3000);
    ws.interval = interval;
  });
};