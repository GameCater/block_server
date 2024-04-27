const { ModelMgr } = require("../../models/modelMgr");
const { CustomError } = require("../error/utils/error");

// req.Model 中间件函数
module.exports = (option) => {
    return async (req, res, next) => {
        // 通过请求参数获取文档构造函数名
        const modelName = require('inflection').classify(req.params.resource);
        // 绑定Model至req
        const model = ModelMgr.getInstance().getModel(modelName);
        if (model) {
            req.Model = model;
            next();
        }
        else {
            next(new CustomError(500, "mount model: invaild model name"));
        }
    }
}