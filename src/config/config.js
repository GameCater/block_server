const path = require("path");

module.exports.config = {
    database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'blog',
        schemasUrl: path.join(__dirname, '/src/models/schemas'),
    },
    app: {
        port: 3000,
        env: process.env.NODE_ENV || 'development',
    }
}