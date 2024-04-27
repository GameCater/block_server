module.exports = (app) => {

    function errorInfo (err) {
        let info = {
            message: err.message,
            stack: err.stack
        }
        return JSON.stringify(info);
    }
    
    function loggerError (err, req, res, next) {
        req.Logger.error(errorInfo(err));
        next(err);
    }

    app.use(loggerError);
}