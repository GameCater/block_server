const { UnauthorizedError } = require("express-jwt");
const { HttpError, CustomError } = require("../utils/error");

module.exports = (app) => {
    function errorInfo (err) {
        let info;
        if (err instanceof HttpError || err instanceof CustomError) {
            info = err.getCodeMsg();
        } 
        else if (err instanceof UnauthorizedError) {
            info = {
                message: err.message,
                code: err.status,
            }
        }
        else {
            info = {
                message: err.message,
                code: err.code,
                stack: err.stack,
            }
        }
        return info;
    }
    
    function loggerError (err, req, res, next) {
        req.Logger.error(errorInfo(err));
        next(err);
    }

    app.use(loggerError);
}