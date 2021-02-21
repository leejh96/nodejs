module.exports = (sequelize, DataTypes) =>{
    //user라는 테이블을 만드는 부분
    //id값은 자동적으로 생성된다.
    return sequelize.define('user',{
        name: {
            //데이터 타입과 길이
            type:DataTypes.STRING(20),
            //NULL 허용여부
            allowNull: false,
            //값이 고유한 값
            unique: true,
        },
        age: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        comment: {
            type:DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type:DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        }

    },{
        timestamps: false,
        underscored: true,
    });
};