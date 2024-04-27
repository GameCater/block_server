const express = require('express');
const path = require('path');

// express应用实例
const app = express();

// 配置history模式支持
// const history = require('connect-history-api-fallback');
// app.use(history({ logger: console.log.bind(console) }));

// 静态文件目录
// app.use(express.static(path.join(__dirname, 'public')));

// 数据库
require('./database');

// 全局中间件模块
require('./middleware')(app);

// 路由模块
require("./routes")(app);

// 状态码处理中间件
const error = require('./middleware/error');
app.use(error());

// 服务器监听3000端口
app.listen(3000, (err) => {
  if (err) throw err;
  console.log('http://localhost:3000');
});