const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};
//.env의 JWT_SECRET을 통해 JWT 토큰 발급 및 인증을 하므로
// 절대로 외부에 알려지면 안되는 것
//jwt 토큰을 통해 검증 
exports.verifyToken = (req, res, next) => {
  try {
    //토큰은 보통 http메시지의 header와 본문중 header에 있기 때문에 그 값을 검증 
    //jwet.verify(토큰, jwt 비밀키)
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // 유효기간 초과
      // 토큰은 프론트엔드로 가기 때문에 해커가 토큰을 해킹할 수 있기 때문에
      // 토큰은 유효기간을 짧게 여러번 생성하도록 한다.
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다',
      });
    }
    //내가 만든 토큰이 아닐경우
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다',
    });
  }
};

//api 사용량 제한
//무료 api limiter
exports.freeApiLimiter = new RateLimit({
  //이 시간 동안
  windowMs: 60 * 1000, // 1분
  //최대 횟수
  max: 1,
  //요청간 간격, 한번 호출하면 windowMs 시간동안 호출할 수 없다.
  delayMs: 0,
  //어겼을 경우
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 한 번만 요청할 수 있습니다.',
    });
  },
});

//api 사용량 제한
//유료 사용자
exports.PremiumApiLimiter = new RateLimit({
  //이 시간 동안
  windowMs: 60 * 1000, // 1분
  //최대 횟수
  max: 10000,
  //요청간 간격, 한번 호출하면 windowMs 시간동안 호출할 수 없다.
  delayMs: 0,
  //어겼을 경우
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 한 번만 요청할 수 있습니다.',
    });
  },
});
//버전이 새로나왔는데 이전버전을 계속 쓸 경우
exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};
