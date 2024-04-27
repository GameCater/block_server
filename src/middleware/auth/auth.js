const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const config = require("../../config");

// 生成token
function setToken(payload) {
  return jwt.sign(
    payload,
    config.auth.secretKey,
    { 
      expiresIn: config.auth.expiresIn,
      algorithm: config.auth.algorithm,
    }
  )
}

// 拦截中间件
function filter() {
  return expressjwt({
    secret: config.auth.secretKey,
    algorithms: [config.auth.algorithm],
    credentialsRequired: true, // 前端必须携带token请求
  })
}

// 放行中间件
function noFilter(pathArr) {
  return expressjwt({
    secret: config.auth.secretKey,
    algorithms: [config.auth.algorithm],
    credentialsRequired: true,
  }).unless({ path: pathArr });
}

module.exports = { setToken, filter, noFilter };