const LocalStategy = require('passport-local').Strategy;
const {User} = require('../models');
const bcrypt = require('bcrypt');
module.exports = (passport) =>{
    passport.use(new LocalStategy({
        usernameField: 'email', //req.body.email
        passwordField: 'password', //req.body.password
    }, async (email, password, done) => { //done함수(에러, 성공, 실패)
        try{
            //사용자가 입력한 이메일을 가진 사람이 있는지 확인
            const exUser = await User.findOne({ where: { email }});
            if (exUser){
                //비밀번호 검사, bcrypt는 암호화하고 비교하는 암호화 알고리즘
                //password는 사용자가 입력한 password
                //exUser.password는 DB에 저장된 password
                const result = await bcrypt.compare(password, exUser.password);// T/F값
                if (result){
                    done(null, exUser);
                }else{
                    //비밀번호가 일치하지 않는 경우
                    done(null, false, {message: '이메일-비밀번호가 일치하지 않습니다.'});
                }
            }else{
                //가입되지 않은 사용자인 경우
                done(null, false, { message: '이메일- 비밀번호가 일치하지 않습니다.' });
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};