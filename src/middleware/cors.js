// 允许访问的白名单
const whitelist = ['http://localhost'];
// 配置
const corsOptions = {
  // origin: function (origin, callback) {
  //   console.log(origin);
  //   if (whitelist.indexOf(origin) !== -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // }
  origin: '*'
}

module.exports = (app) => {
  const cors = require('cors');
  app.use('*', cors(corsOptions));
}