const express = require('express');
const app = express();
require('./database')(app);
require('./middleware')(app);
require("./routes")(app);

// 中间件的注册顺序非常重要，错误处理中间件需要最后注册
require("./middleware/error")(app);

const config = require('./config');
app.listen(config.server.port, (err) => {
    if (err) throw err;
    console.log(`server is running at http://localhost:${config.server.port}`);
});