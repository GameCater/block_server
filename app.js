const express = require('express');
const path = require('path');

// express应用实例
const app = express();

// req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 连接数据库
require('./config/db');

// 配置cors
require('./middleware/cors')(app);

// 路由拦截并解析token
const { noFilter } = require('./utils/auth');
// 只放行管理端登录接口
app.use(noFilter(['/admin/login']));

// 加载路由
require('./routes/admin')(app);

// 状态码处理中间件
const error = require('./middleware/error');
app.use(error());

// 服务器监听3000端口
app.listen(3000, (err) => {
  if (err) throw err;
  console.log('http://localhost:3000');
});