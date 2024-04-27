const path = require("path");

const config = {
    database: {
        host: "127.0.0.1",
        port: 27017,
        name: "blog",
        schemasUrl: path.join(__dirname, '../models/schemas'),
        schemasInitConfig: "config.js",
        schemasStateRecordJson: path.join(__dirname, '../models/schemas/state.json'),
    },
    server: {
        host: "127.0.0.1",
        port: 3000,
        env: process.env.NODE_ENV || "development",
        projectName: "blog_server",
    },
    log: {
        minimunLevel: "debug",
        storePath: path.join(__dirname, '../../logs'),
    }
}

module.exports = (() => {
    let env = config.server.env;
    let complete = {};
    if (env === "development") {
        complete = Object.assign(complete, config, require("./development"));
    } else if (env === "production") {
        complete = Object.assign(complete, config, require("./production"));
    }
    return complete;
})();