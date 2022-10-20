// 响应状态码处理中间件
module.exports = (app) => {
  return (err, req, res, next) => {
    if (err.status === 401) {
      if (err.name === 'TokenExpiredError') {
        res.send({ status: 401, message: 'token已过期'});
      } else {
        res.send({ status: 401, message: 'token无效'});
      }
    } else if (err.status === 404) {
      res.send({ status: 404, message: '资源不存在'});
    } else if (err.status === 402) {
      res.send({ status: 402, message: err.message });
    } else {
      res.send({ status: err.status, message: err.message });
    }
  }
}