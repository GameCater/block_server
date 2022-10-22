const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');

// 配置token
const SECRET_KEY = 'ALO_BLOG';
const EXPIRE_IN = '1h';
const ALGORITHM = 'HS256';

// 生成token
function setToken(payload) {
  return jwt.sign(
    payload,
    SECRET_KEY,
    { 
      expiresIn: EXPIRE_IN,
      algorithm: ALGORITHM,
    }
  )
}

// 拦截中间件
function filter() {
  return expressjwt({
    secret: SECRET_KEY,
    algorithms: [ALGORITHM],
    credentialsRequired: true, // 前端必须携带token请求
  })
}

// 放行中间件
function noFilter(pathArr) {
  return expressjwt({
    secret: SECRET_KEY,
    algorithms: [ALGORITHM],
    credentialsRequired: true,
  }).unless({ path: pathArr });
}

module.exports = { setToken, filter, noFilter };