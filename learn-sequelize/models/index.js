const path = require('path');
const Sequelize = require('sequelize');

//config에서 가져올 값을 저장
//development로 사용하는데 나중에 실서비스에서 배포할 때는 production으로 만들어준다.
const env = process.env.NODE_ENV || 'development';
//sequelize에 대한 설정파일(db내용)
const config = require('../config/config.json')[env];

//Sequelize 패키지를 이용해 sequelize 인스턴스를 만드는 부분 
//config 안에 있는 username, password, database 등을 가져오는 부분
//이 구조는 외우면 된다.
const sequelize = new Sequelize(config.database, config.username, config.passsword, config)
//db객체를 만들고 나중에 모듈화 하기 위한 db 객체
const db ={};
//db객체 안에 sequelize 패키지와 sequelize 인스턴스도 넣어본다.
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//user와 comment 테이블을 불러오고 불러올때 sequelize인스터스와 Sequelize 패키지를 넣어줌
//(sequelize, Sequelize)이 부분이 user, comment.js의 매개변수로 이어진다.
db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

//하나의 유저는 여러개의 댓글을 가질 수 있으며
//하나의 댓글은 하나의 유저만 적을 수 있으니 일대다관계를 가지게 되고
//hasMany는 User가 여러개의 Comment를 가질 수 있는 DB라고 관계를 맺어주는 부분
//sourceKey, targetKey는 user테이블의 id값을 comment테이블에 commenter 값과 연결
db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'});
//Comment DB가 User에 속한다고 지정하는 부분, foreignKey를 지정하면
//foreignKey로 지정한 컬럼이 belongTo에 적힌 테이블에 생성된다.
db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});
// 위의 두가지를 적음으로써 일대다 관계 형성

module.exports = db;
