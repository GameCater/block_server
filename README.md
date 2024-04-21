## 博客服务端
### 依赖包
- mongoose mongodb文档CURD
- jsonwebtoken 生成token
- bcrypt 密码加密
- inflection 转字符串为规格化类名
- multer form-data文件上传
- uuid 上传文件随机命名避免覆盖
- jsonwebtoken 生成token
- express-jwt express解析token、拦截请求
- http-assert 断言响应错误
- cors 跨域访问
- connect-history-api-fallback 支持前端history模式

### 目录文件
- config 服务器配置项
- middleware express使用的中间件
- utils 开发中用到的工具函数
- routes 后端路由
- controllers 路由请求处理函数（暂存）
- models 数据库文档对象CURD
- public 服务器静态资源

### 进度
1. 2022-10-20 后台api接口开发与测试
2. 2022-10-21 配置history模式，更新部分接口
3. 2022-10-22 修改了列表api，采取后端分页办法
4. 2022-10-31 修改了文章数据模型
5. 2022-11-13 新增评论api

### 任务
- [X] 日志模块
- [ ] 重构跨域模块
- [ ] 路由模块