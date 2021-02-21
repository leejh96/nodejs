const express = require('express');
const router = express.Router();
//app.get -> router.get 이런식으로 교체
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res, next) => {
  //http에선 res.end를 사용했지만 express에선 send를 사용
  // res.send('hello express');
  
  // error 500을 위한 서버 오류 코드
  // try{
  //   throw new Error('서버를 고장내주마');
  // }
  // catch(err){
  //   next(err);
  // }
  
  //views의 있는 test파일을 가져오라는 뜻
  console.log('hello express');
  res.render('index');
});


router.post('/', (req,res)=>{

});

router.delete('/', (req, res)=>{

});
module.exports = router;
