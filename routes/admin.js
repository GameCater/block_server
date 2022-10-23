// REST风格
module.exports = (app) => {
  const express = require('express');
  // 实例化admin 路由器
  const router = express.Router();
  
  // 创建资源
  router.post('/', async (req, res) => {
    try {
      const model = await req.Model.create(req.body);
      res.send(model);
    } catch (error) {
      console.log(error.message);
    }
  });

  // 修改资源
  router.put('/:id', async (req, res) => {
    try {
      const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
      res.send(model);
    } catch (error) {
      console.log(error.message);
    }
  });

  // 删除资源
  router.delete('/:id', async (req, res) => {
    try {
      await req.Model.findByIdAndRemove(req.params.id);
      res.send({ status: true });
    } catch (error) {
      console.log(error.message);
    }
  });

  // 资源列表
  router.get('/', async (req, res) => {
    try {
      // 当前页 每页大小
      const { page, pageSize } = req.query;
      // 查询配置
      const queryOption = {
        skip: (page - 1) * pageSize,
        limit: pageSize
      };
      // 返回数据总长度
      const count = await req.Model.count();
      // 返回分页查询结果
      const models = await req.Model.find().setOptions(queryOption);
      res.send({ data: models, count });
    } catch (error) {
      console.log(error.message);
    }
  });

  // 资源详情
  router.get('/:id', async (req, res) => {
    try {
      const model = await req.Model.findById(req.params.id);
      res.send(model);
    } catch (error) {
      console.log(error.message);
    }
  });
  
  // resource中间件，绑定req.Model
  const resource = require('../middleware/resource');
  app.use('/admin/api/rest/:resource', resource(), router);

  // multer 中间件
  const upload = require('../middleware/upload');
  // 上传文件
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    // 文件在服务器中的地址
    file.url = `http://localhost:3000/public/uploads/${file.filename}`;
    res.send(file);
  });

  const assert = require('http-assert');
  const { setToken } = require('../utils/auth');
  const { User } = require('../models/models');
  // 管理员登录
  app.post('/admin/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      // 检验用户是否存在
      const user = await User.findOne({ username }).select('+password'); // 强制包含已在schema level排除的字段
      assert(user, 422, '用户不存在');
      
      // 检验密码是否一致
      const isValid = require('bcrypt').compareSync(password, user.password);
      assert(isValid, 422, '密码不正确');

      // 检验访问者的权限
      assert(user.isAdmin, 403, '无访问权限');

      const token = setToken({ id: user._id });
      res.send({ status: true, token: token, data: { ...user._doc } }); // 前端传输token时需加前缀 Bearer 
    } catch (error) {
      res.send({ status: false, message: error.message });
    }
  });
}