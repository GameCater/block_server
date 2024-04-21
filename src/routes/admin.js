const commonController = require('../controllers/common/common');

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
  const resource = require('../middleware/resource');
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

  const assert = require('http-assert');
  const { setToken } = require('../utils/auth');
  const { User } = require('../models/schemas/user/user');
  const { UserGroup } = require('../models/schemas/user/userGroup');
  const { Group } = require('../models/schemas/user/group'); 
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
      // assert(user.isAdmin, 403, '无访问权限');
      const userGroup = await UserGroup.findOne({ userId: user._id });
      const group = await Group.findById(userGroup.groupId);
      assert(group.name === "admin", 403, '无访问权限');

      const token = setToken({ id: user._id });
      res.send({ status: true, token: token, data: { ...user._doc } }); // 前端传输token时需加前缀 Bearer 
    } catch (error) {
      res.send({ status: false, message: error.message });
    }
  });
}