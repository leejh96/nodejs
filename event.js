//미리 이벤트리스너를 만들어두고 이벤트리스너는 특정한 이벤트가 발생했을 때
//어떤 동작을 할지 정의하는 부분
//ex) 사람들이 서버에 방문(이벤트)하면 html파일을 줄거야(콜백함수) => 이벤트리스너


//이벤트를 마음대로 만들 수 있도록 하는 모듈로 가짜 이벤트 생성
const EventEmitter = require('events');
const callback = ()=>{
    console.log('제발좀 가세요');
};
const myEvent = new EventEmitter();

myEvent.addListener('방문',()=>{
    console.log('방문해주셔서 감사합니다.');
});
//on과 addListener 는 같은 기능이다. 일종의 별명 그러므로 on을 쓰자
//하나의 이벤트에 대하여 여러개의 이벤트 리스너를 다는것도 가능하다.
myEvent.on('종료', () =>{
    console.log('안녕히가세요');
});

//아래 이벤트리스너의 원래 모양이지만 밑에 removeListener를 위해 callback변수로 바꿈
// myEvent.on('종료', ()=>{
//     console.log('제발좀 가세요');
// });
myEvent.on('종료', callback);

//once는 한번만 실행되는 리스너
myEvent.once('특별이벤트', ()=>{
    console.log('한 번만 실행됩니다.');
});

//가짜이벤트 발생기
myEvent.emit('방문');
myEvent.emit('종료');
myEvent.emit('특별이벤트');
myEvent.emit('특별이벤트');//한번만 실행되는 것이므로 무시

//계속이라는 이벤트리스너를 만듦
myEvent.on('계속', () =>{
    console.log('계속 리스닝');
});
//이벤트 리스너 지우기
myEvent.removeAllListeners('계속');//하나의 이벤트에 여러개의 리스너가 붙어있어도 다 지워짐
myEvent.emit('계속');//이벤트리스너를 지워서 무시

//이벤트리스너 하나만 지우기, 종료라는 이벤트의 두개의 이벤트리스너가 있을 때
//지우고자 하는 이벤트리스너의 콜백부분을 변수로 빼서 지워준다.

myEvent.removeListener('종료',callback)
myEvent.emit('종료');//이벤트리스너를 지웠기 때문에 무시

console.log(myEvent.listenerCount('종료'));//원래 종료가 두개였지만 removeListener로 하나지워서 1