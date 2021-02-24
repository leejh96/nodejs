module.exports = (sequelize, DataTypes) => {
    //{charset:'utf8', collate:'utf8_general_ci'}는 한글을 쓸수있게 해줌
    return sequelize.define('user',{
        email:{
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull: true,//카카오 로그인을 위해서 null값을 true로 줌            
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId:{
            //카카오로 로그인했을 경우에만 카카오아이디를 저장하는곳
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true, //삭제일 기록, 데이터 복구가능
        charset:'utf8',
        collate:'utf8_general_ci'
    })
};