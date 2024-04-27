const { noFilter } = require("./auth")

module.exports = (app) => {
    app.use(noFilter(
        [
            '/admin/api/login', 
            { url: '/web/api/tag/list', methods: 'GET' },
            { url: '/web/api/article/list', methods: 'GET' },
            { url: '/web/api/article/search', methods: 'GET' },
            { url: /^\/web\/api\/article\/.*/, methods: 'GET' },
            { url: /^\/web\/api\/comment\/.*/, methods: 'GET' },
            { url: '/web/api/comment/create', methods: 'POST' },
        ]
    ));
}