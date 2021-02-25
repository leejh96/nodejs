const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    //로그인 한 사람 찾기 (자기 자신)
    const user = await User.findOne({ where: { id: req.user.id } });
    //팔로잉을 넣어주는 부분
    //로그인 한 사람이 팔로잉을 하면 팔로잉 한 사람한테는 팔로워가 되는 부분 
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
      //로그인 한 사람 찾기 (자기 자신)
      const user = await User.findOne({ where: { id: req.user.id } });
      //팔로잉을 끊는 부분
      //로그인 한 사람이 팔로잉을 하면 팔로잉 한 사람한테는 팔로워가 끊기는 부분 
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } catch (error) {
      console.error(error);
      next(error);
    }
});

router.post('/profile', async(req,res,next)=>{
    try{
        await User.update({nick : req.body.nick,},{where: {id: req.user.id}})
        res.redirect('/profile');
    }catch(error){
        console.error(error);
        next(error);
    }
})
  
module.exports = router;