const config = require('../../config');
const { HttpError } = require('../../middleware/error/utils/error');
const { ModelMgr } = require('../../models/modelMgr');
const { ESchemaName } = require('../../models/names');
const { wrap } = require("../../utils/response");
const { getFileType } = require("../../utils/fileUtil");

module.exports = {
    login: async (req, res, next) => {
        const User = ModelMgr.getInstance().getModel(ESchemaName.User);
        const UserGroup = ModelMgr.getInstance().getModel(ESchemaName.UserGroup);
        const Group = ModelMgr.getInstance().getModel(ESchemaName.Group);

        const { setToken } = require("../../middleware/auth/auth");
        const assert = require("http-assert");
        try {
            const { username, password } = req.body;
            // 检验用户是否存在
            const user = await User.findOne({ username }).select('+password'); // 强制包含已在schema level排除的字段
            if (!user)
                throw new HttpError(404, "用户不存在！");

            // 检验访问者的权限
            const userGroup = await UserGroup.findOne({ userId: user._id });
            const group = await Group.findById(userGroup.groupId);
            if (group && group.name !== "admin")
                throw new HttpError(1201, "无管理员权限！");

            // 检验密码是否一致
            const isValid = require('bcrypt').compareSync(password, user.password);
            if (!isValid)
                throw new HttpError(1201, "密码不对！");

            const token = setToken({ id: user._id });
            const response = {
                code: 200,
                data: {
                    token,
                    other: user
                }
            }
            res.send(response); // 前端传输token时需加前缀 Bearer 
        }
        catch (err) {
            next(err);
        }
    },
    upload: async (req, res, next) => {
        try {
            const files = req.files;
            const ext = JSON.parse(req.body.ext);
            files.forEach((file, idx) => {
                const host = config.server.host;
                const port = config.server.port;
                const subDir = getFileType(file.mimetype);
                file.serverPath = `http://${host}:${port}/${subDir}/${file.filename}`;
                file.ext = ext[idx];
            });

            res.send(wrap(200, undefined, { data: files }));
        }
        catch (err) {
            next(err);
        }
    }
}