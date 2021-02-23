module.exports = (sequelize, DataTypes) => {
    return sequelize.define('post', {
        content: {
            type: DataTypes.STRING(140),
            allowNull: false,
        },
        //이미지 주소를 서버에 저장해두고 불러올 것
        img: {
            type:DataTypes.STRING(200),
            allowNull: true,
        },
    },{
        timestamps: true,
        paranoid: true
    })
};