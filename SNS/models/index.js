'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize,Sequelize);

//사용자와 게시물과의 관계 일(user)대다(post)
//일대다는 일이 무조건 HasMany로 먼저오고 후에 belongTo가 나온다.
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

//게시물과 해시태그의 관계 다대다
//다대다관계, through에는 새로 생기는 테이블의 이름을 지정해준다(매칭테이블)
//순서 상관없음
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});


//팔로잉 팔로워 관계 다대다
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'followingId'});//일반인
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'followerId'});//유명한사람

//게시물과 좋아요의 관계 다대다
db.User.belongsToMany(db.Post, {through: 'Like'});
db.Post.belongsToMany(db.User, {through: 'Like'});

module.exports = db;
