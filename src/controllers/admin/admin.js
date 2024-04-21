const { ModelMgr } = require('../../models/modelMgr');
const { ESchemaName } = require('../../models/names');

module.exports = {
    login: async (req, res) => {
        const User = ModelMgr.getInstance().getModel(ESchemaName.User);
        const UserGroup = ModelMgr.getInstance().getModel(ESchemaName.UserGroup);
        const Group = ModelMgr.getInstance().getModel(ESchemaName.Group);

        const { setToken } = require("../../utils/auth");
        const assert = require("http-assert");

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
    }
}