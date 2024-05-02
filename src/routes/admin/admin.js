const admin = require('../../controllers/admin/admin');
const commonController = require('../../controllers/common/common');

module.exports = (app) => {
    const express = require('express');
    // 实例化admin 路由器
    const router = express.Router();
    // 创建资源
    router.post('/', commonController.add);
    // 删除资源
    router.delete('/:id', commonController.delete);
    // 修改资源
    router.put('/:id', commonController.update);
    // 资源列表
    router.get('/', commonController.find);
    // 资源详情
    router.get('/:id', commonController.find);

    // resource中间件，绑定req.Model
    const resource = require('../../middleware/other/resource');
    app.use('/admin/api/rest/:resource', resource(), router);

    // 上传文件
    const upload = require('../../middleware/other/upload');
    app.post('/admin/api/upload', upload.array('files'), admin.upload);

    // 后台用户登录
    app.post('/admin/api/login', admin.login);
}