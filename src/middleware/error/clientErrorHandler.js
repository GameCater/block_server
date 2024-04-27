module.exports = (app) => {
    function clientErrorHandler (err, req, res, next) {
        res.status(500).send(err.message);
    }

    app.use(clientErrorHandler);
}