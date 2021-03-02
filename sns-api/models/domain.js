// 카카오 로그인 구현때처럼 키같은 것을 발급하고 플랫폼을 생성해주는 곳
//도메인 입력시 localhost:8003 이렇게만 입력
module.exports = (sequelize, DataTypes) => (
  sequelize.define('domain', {
    host: {
      //이 api를 쓸 수 있는 위치를 제한
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    type: {
      //유료사용자, 무료사용자를 나눠서 기능을 다르게 해줄때사용
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    clientSecret: {
      //카카오에서 발급받은 키같은 것을 저장해두는 곳
      type: DataTypes.STRING(40),
      allowNull: false,
    },r
  }, {
    //데이터가 올바르게 들어왔는지 검사하는 부분
    validate: {
      unknownType() {
        //this.type은 위에 type의 값, free이거나 premium이거나
        console.log(this.type, this.type !== 'free', this.type !== 'premium');
        if (this.type !== 'free' && this.type !== 'premium') {
          throw new Error('type 컬럼은 free나 premium이어야 합니다.');
        }
      },
    },
    timestamps: true,
    paranoid: true,
  })
);
