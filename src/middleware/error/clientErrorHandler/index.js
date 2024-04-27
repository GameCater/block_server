const { UnauthorizedError } = require("express-jwt");
const { HttpError, CustomError } = require("../utils/error");

module.exports = (app) => {
    function clientErrorHandler (err, req, res, next) {
        let response = {
            code: 500,
            message: 'unkown error',
        }
        if (err instanceof HttpError || err instanceof CustomError) {
            let errorInfo = err.getCodeMsg();
            response.code = errorInfo.code;
            response.message = errorInfo.msg;
        }
        else if (err instanceof UnauthorizedError) {
            response.code = err.status;
            response.message = err.message;
        }
        else if (err instanceof Error) {
            response.message = err.message;
        }
        res.status(response.code).send(response);
    }

    app.use(clientErrorHandler);
}