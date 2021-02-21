const express = require('express');
const router = express.Router();
const {User, Comment} = require('../models');
// /:id는  /뒤에 아무거나 온다는 것을 의미
router.get('/:id',(req,res,next) => {
    Comment.findAll({
        //모델간의 관계연결
        include:{
            //어떤 모델인지 지정
            model:User,
            //쿼리조건 설정
            where: {
                // /:id에 있는 값 가져오기
                id:req.params.id
            }
        }
    })
        .then((comments)=>{
            console.log(comments);
            res.json(comments);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
})
router.patch('/:id',(req,res,next) => {
    Comment.update({
        //수정하는 내용
        comment: req.body.comment,
    },{
        //수정될 내용
        where: {id: req.params.id},
    })
        .then((result)=>{
            console.log(result);
            res.json(result);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
});

router.delete('/:id',(req,res,next) => {
    Comment.destroy({
        //id가 req.params.id인것을 삭제
        where : {id : req.params.id},
    })
})

//나머지는 뭘 가져오거나 수정하거나 지울지를 선택하지만
//post는 새로 생성하는 것이므로 :id가 안붙는다
router.post('/',(req,res,next) => {
    Comment.create({
        commenter: req.body.id,
        comment: req.body.comment,
    })
    .then((comments)=>{
        console.log(comments);
        res.json(comments);
    })
    .catch((err)=>{
        console.error(err);
        next(err);
    });
})