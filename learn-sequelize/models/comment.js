//DB에서 table을 sequelize에서는 model이고 그것을 모듈로 만들는 부분
module.exports = (sequelize, DataTypes) => {
    //comment라는 테이블을 만드는 부분
    //define에는 (테이블이름, 테이블내용)이 적혀야한다.
    return sequelize.define('comment',{
        //commenter는 일대다관계를 설정하여 안적어줘도 된다.
        comment: {
            type:DataTypes.STRING(100),
            allowNull: false
        },
        create_at: {
            type:DataTypes.DATE,
            allowNull: false,
            //DB에게 생성시간을 자동으로 만들 수 있음
            defaultValue: sequelize.literal('now()'),
        }
    },{
        //이부분 즉 3번째 인자는 옵션을 의미
        //생성시간을 sequelize가 자동으로 기록
        timestamps: false,
        //(_)사용을 권장, false이면 createdAt과 같이 (_)사용안하는 것을 권장
        underscored: true,
    });
};