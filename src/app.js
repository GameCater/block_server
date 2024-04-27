const express = require('express');
// express应用实例
const app = express();

// 配置history模式支持
// const history = require('connect-history-api-fallback');
// app.use(history({ logger: console.log.bind(console) }));

// 数据库
require('./database')(app);
// 中间件
require('./middleware')(app);
// 路由
require("./routes")(app);

const config = require('./config');
app.listen(config.server.port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`server is running at http://localhost:${config.server.port}`);
});