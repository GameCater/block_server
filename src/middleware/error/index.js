module.exports = (app) => {
    // 错误响应打印
    require("./loggerError")(app);

    // 客户端错误响应
    require("./clientErrorHandler")(app);
}