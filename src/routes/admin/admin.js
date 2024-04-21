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
  const resource = require('../../middleware/resource');
  app.use('/admin/api/rest/:resource', resource(), router);

  // multer 中间件
  // const upload = require('../middleware/upload');
  // // 上传文件
  // app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
  //   const file = req.file;
  //   // 文件在服务器中的地址
  //   file.url = `http://localhost:3000/public/uploads/${file.filename}`;
  //   res.send(file);
  // });

  // 后台用户登录
  app.post('/admin/api/login', admin.login);
}