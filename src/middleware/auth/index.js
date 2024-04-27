const { noFilter } = require("./auth")
const config = require("../../config")
module.exports = (app) => {

    let whitelist = [
        '/admin/api/login',
        { url: '/web/api/tag/list', methods: 'GET' },
        { url: '/web/api/article/list', methods: 'GET' },
        { url: '/web/api/article/search', methods: 'GET' },
        { url: /^\/web\/api\/article\/.*/, methods: 'GET' },
        { url: /^\/web\/api\/comment\/.*/, methods: 'GET' },
        { url: '/web/api/comment/create', methods: 'POST' },
    ]

    // 放行方便调试
    if (config.server.env !== "development")
        app.use(noFilter(whitelist));
}