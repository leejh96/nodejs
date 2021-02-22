const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment')
router.get('/:id', (req, res, next) => {
    //사용자의 아이디가 /뒤에 아이디값인 아이디의 값을 가져와라
    //populate는 include와 유사함
    //ObjectId값에 해당하는 commenter값을 불러옴
    Comment.find({commenter: req.params.id}).populate('commenter')
        .then((comments) => {
            res.json(comments);
        })
        .catch((error)=>{
            console.error(error);
            next(error);
        })
});
router.patch('/:id', (req, res, next) => {
//수정
    //sequelize와 반대로 조건이 먼저나오고 수정할 내용이 두번째로나온다.
    Comment.update({_id: req.params.id},{comment: req.body.comment})
        .then((result) =>{
            //성공하면 201과 함께 결과를 프론트로 보내줌
            res.json(result);
        })
        .catch((error) =>{
            console.error(error);
            next(error);
        })
});

router.delete('/:id', (req, res, next)=>{
//삭제
    Comment.remove({_id: req.params.id})
    .then((result) =>{
        //성공하면 201과 함께 결과를 프론트로 보내줌
        res.json(result);
    })
    .catch((error) =>{
        console.error(error);
        next(error);
    })
});
router.post('/', (req, res, next)=>{
//등록
    const post = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,

    });
    post.save()
        .then((result) =>{
        //성공하면 201과 함께 결과를 프론트로 보내줌
        res.status.json(201).json(result);
        })
        .catch((error) =>{
        console.error(error);
        next(error);
    });
});

module.exports = router;