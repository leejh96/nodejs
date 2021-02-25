const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Post, Hashtag, User } = require('../models');
const hashtag = require('../models/hashtag');
const { isLoggedIn } = require('./middlewares');


const upload = multer({
    //storage는 업로드 파일을 어디에 저장할지 선택하는 것으로
    //diskStorage는 서버의 디스크에 저장하고
    //외부스토리지에 저장하는 법도 있다.
    storage: multer.diskStorage({
        //파일 저장 경로
        destination(req, file, cb){
            cb(null, 'uploads/');
        },
        //파일 이름을 지정
        //multer는 처음에 파일명을 아무거나 만들고 확장자도 안붙여준다.
        //따라서 직접 넣어줘야한다.
        filename(req, file, cb){
            //file에 있는 확장자 가져오기
            //extname은 파일의 확장자명
            const ext = path.extname(file.originalname);
            //basename은 파일 명
            //확장자를 제외한 파일명 + 현재시간 + 확장자
            //cb는 callback이고 첫 인자는 에러 인자이다. done과 비슷
            cb(null, path.basename(file.originalname, ext)+ Date.now() + ext);    
        }
    }),
    //fileSize를 5메가바이트 까지만 가능하게 만들어줌
    //1kb = 1024byte, 1mb = 1024kb
    limits: {fileSize: 5 * 1024 *1024}
});

//이미지를 업로드하기 위해서는 html의 form의 enctype값을 multipart/form-data로
//만들어줘야 하고(이 부분은 html부분) 이렇게 만들어진 multipart/form-data를 
//해석하기 위해서는 multer가 필요하다.

//이미지 업로드 라우터
//single은 이미지 하나, array는 이미지 여러개 대신 하나의 필드
//fields는 이미지 여러개 대신 여러개의 필드
//none은 이미지x
//single안에 img는 html에서 type이 file인 input 태그의 id나 name을 넣어주면 된다.
router.post('/img', isLoggedIn, upload.single('img'), (req,res)=>{
    //이미지를 multer로 업로드하면 req.file에 그 내용이 저장된다.
    //이미지가 서버어디에 저장되어 있는지 json으로 프론트에 보내준다.
    res.json({url: `/img/${req.file.filename}`});
});


//게시글 업로드 라우터
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next)=>{
    try{
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            //해당 게시글이 누구의 게시글인지 확인하기 위한 id
            userId: req.user.id,
        })
        //정규표현식으로hashtag 설정
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        // ex)안녕하세요 #노드 #익스프레스 라면 
        // hashtags = ['#노드', '#익스프레스']
        if(hashtags){
            //findOrCreate는 DB에서 있으면 찾고 없으면 새로 만들어줌
            //즉 Hashtag DB에서 hashtags 배열의 값을 하나씩 찾아보고 없으면 만듦
            const result = await Promise.all(hashtags.map(tag =>
                Hashtag.findOrCreate({
                //tag.slice(1).toLowerCase()은 앞에 #을 지우고 대소문자 구별을
                //안하기 위해 모두 소문자로 변경
                where: {
                    title: tag.slice(1).toLowerCase()},
                })
            )); 
            //게시글인 post와 해쉬태그인 result를 이어준다.
            //post와 해쉬태그는 다대다 관계이다.
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.delete('/:id', async(req, res, next)=>{
    try {
        await Post.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            } 
        });
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//해시태그를 검색하면 보여주는 페이지
router.get('/hashtag', async (req, res, next) => {
    //query는 사용자가 검색하고자 하는 해시태그
    const query = req.query.hashtag;
    if (!query) {
      return res.redirect('/');
    }
    try {
      const hashtag = await Hashtag.findOne({ where: { title: query } });
      let posts = [];
      if (hashtag) {
          //찾은게 있다면 그 해시태그로 getPosts하여 그 해시태그를 넣은
          //모든 게시물을 가져온다.
        posts = await hashtag.getPosts({ include: [{ model: User }] });
      }
      //검색결과를 twits에 넣는다.
      return res.render('main', {
        title: `${query} | NodeBird`,
        user: req.user,
        twits: posts,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

  router.post('/:id/like', async(req, res, next)=>{
    try{
        const post = await Post.findOne({where : {id : req.params.id}});
        await post.addLiker(req.user.id);
        res.send('OK');
    } catch(error){
        console.error(error);
        next(error);
    }
  });

  router.delete('/:id/unlike',async(req, res, next)=>{
    try{
        const post = await Post.findOne({where : {id : req.params.id}});
        await post.removeLiker(req.user.id);
        res.send('OK');
    } catch(error){
        console.error(error);
        next(error);
    }
  });
  
  module.exports = router;