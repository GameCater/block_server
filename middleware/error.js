// 响应状态码处理中间件
module.exports = (app) => {
  return (err, req, res, next) => {
    if (err.status === 401) {
      if (err.name === 'TokenExpiredError') {
        res.send({ status: false, message: 'token已过期'});
      } else {
        res.send({ status: false, message: 'token无效'});
      }
    } else if (err.status === 404) {
      res.send({ status: false, message: '资源不存在'});
    } else if (err.status === 402) {
      res.send({ status: false, message: err.message });
    } else {
      res.send({ status: false, message: err.message });
    }
  }
}