const express = require('express');
const path = require('path');

// express应用实例
const app = express();

// req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 配置history模式支持
// const history = require('connect-history-api-fallback');
// app.use(history({ logger: console.log.bind(console) }));

// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 连接数据库
require('./config/db');

// 配置cors
require('./middleware/cors')(app);

// 路由拦截并解析token
const { noFilter } = require('./utils/auth');
// 放行管理端登录接口和前台所有接口
app.use(noFilter(
  [
    '/admin/api/login', 
    { url: '/web/api/tag/list', methods: 'GET' },
    { url: '/web/api/article/list', methods: 'GET' },
    { url: '/web/api/article/search', methods: 'GET' },
    { url: /^\/web\/api\/article\/.*/, methods: 'GET' },
  ]
));

// 加载路由
require('./routes/admin')(app);
require('./routes/web')(app);

// 状态码处理中间件
const error = require('./middleware/error');
app.use(error());

// 服务器监听3000端口
app.listen(3000, (err) => {
  if (err) throw err;
  console.log('http://localhost:3000');
});