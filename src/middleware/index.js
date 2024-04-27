module.exports = (app) => {
    const config = require("../config");
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
    app.use(express.static(config.static.path));
}