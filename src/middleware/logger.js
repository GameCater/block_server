module.exports = (options) => {
    const { format } = options;
    setup(format);
    function setup(format) {
        const regexp = /:(\w+)/g;
    
        return function createLogger(req, res, next) {
            const str = format.replace(regexp, (match, property) => {
                return req[property];
            });
    
            console.log(str);
            next();
        }
    }
}