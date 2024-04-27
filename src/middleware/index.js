module.exports = (app) => {
    // 日志打印
    require("./log")(app);
    // 前后端分离跨域处理
    require("./cors")(app);
    // 身份验证
    require("./auth")(app);

    const express = require('express');
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

}