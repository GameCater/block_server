module.exports = (app) => {
    // 注入 logger
    let logReject = require("./logReject")();
    app.use(logReject);

    require("./loggerRequest")(app);
};