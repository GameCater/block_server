module.exports = (app) => {
    // 日志打印
    require("./log")(app);
    // 前后端分离跨域处理
    require("./cors")(app);
    // 身份验证
    require("./auth")(app);

    // 请求内容格式化
    const express = require('express');
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // 静态文件目录
    const config = require("../config");
    app.use(express.static(config.static.path));

    // 错误处理
    require("./error")(app);
}