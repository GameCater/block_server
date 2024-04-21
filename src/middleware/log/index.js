module.exports = (app) => {
    let logMiddleware = require("./log")();

    function logData(req, msg) {
        let data = {
            method: req.method,
            url: req.url,
            host: req.headers.host,
            referer: req.headers.referer,
            userAgent: req.headers["user-agent"],
            msg: msg || ""
        }
        return JSON.stringify(data);
    }

    let reqLogger = (req, res, next) => {
        req.Logger.info(logData(req));
        next();
    }

    app.use([logMiddleware, reqLogger]);
};