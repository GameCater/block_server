const { ModelMgr } = require("../models/modelMgr");

// req.Model 中间件函数
module.exports = (option) => {
  return async (req, res, next) => {
    // 通过请求参数获取文档构造函数名
    const modelName = require('inflection').classify(req.params.resource);
    // 绑定Model至req
    req.Model = ModelMgr.getInstance().getModel(modelName);
    next();
  }
}