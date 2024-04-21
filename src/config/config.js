const path = require("path");

module.exports.config = {
    database: {
        host: "127.0.0.1",
        port: 27017,
        name: "blog",
        schemasUrl: path.join(__dirname, '../models/schemas'),
        schemasInitConfig: "config.js",
        schemasStateRecordJson: path.join(__dirname, '../models/schemas/state.json'),
    },
    app: {
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