// 允许访问的白名单
const whitelist = ['http://localhost:8080', 'http://localhost:8090'];
// 配置
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

module.exports = (app) => {
  const cors = require('cors');
  app.use('*', cors(corsOptions));
}