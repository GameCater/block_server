const config = require("../../config");
const { assemble } = require("../../utils/arrayUtil");

// 允许访问的白名单
const whitelist = (() => {
    let clientOrigins = config.client.origin;
    let whitelist = [];
    assemble(clientOrigins, whitelist);
    return whitelist;
})();

const corsOptionsDelegate = function (req, callback) {
    let corsOptions = {
        origin: false
    };
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        }
    } else {
        corsOptions = {
            origin: false
        }
    }
    callback(null, corsOptions);
}

module.exports = (app) => {
    const cors = require('cors');
    app.use('*', cors(corsOptionsDelegate));
}