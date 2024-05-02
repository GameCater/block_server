const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");
const { CustomError, HttpError } = require("../../../middleware/error/utils/error");

/** 用户 */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    email: {
        type: String,
    },
    nickname: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
});

SchemaDecorator.getInstance().setDefaultData(UserSchema, {
    username: "root",
    password: "123456",
});

UserSchema.statics.st_add = async function (data) {
    const { username, password } = data;
    if (username && password) {
        const modelMgr = ModelMgr.getInstance();
        const User = modelMgr.getModel(ESchemaName.User);
        const UserGroup = modelMgr.getModel(ESchemaName.UserGroup);
        const Group = modelMgr.getModel(ESchemaName.Group);

        const session = await mongoose.startSession();
        let newUser, defaultGroup;
        try {
            await session.withTransaction(async () => {
                newUser = await User.create([{ username, password }], { session });
                defaultGroup = await Group.find({ name: "user" }).session(session);
                if (defaultGroup && defaultGroup.length) {
                    await UserGroup.create([{ userId: newUser[0]._id, groupId: defaultGroup[0]._id }], { session });
                } else {
                    throw new CustomError(1201, "新用户添加失败，没有设置默认用户组");
                }
            });
        }
        finally {
            session.endSession();
        }
        return {
            code: 200,
            data: {
                user: newUser,
                group: defaultGroup
            }
        }
    }
    else {
        throw new HttpError(1201, "请输入完整的用户名和密码");
    }
}

UserSchema.statics.st_delete = async function (data) {
    const { username, id } = data;
    if (id) {
        const modelMgr = ModelMgr.getInstance();
        const User = modelMgr.getModel(ESchemaName.User);
        const UserGroup = modelMgr.getModel(ESchemaName.UserGroup);
        
        const session = await mongoose.startSession();
        let result;
        try {
            result = await User.deleteOne({ _id: id });
            await UserGroup.deleteOne({ userId: id });
        }
        finally {
            session.endSession();
        }
        return {
            code: 200,
            data: result
        }
    }
}

const User = mongoose.model(ESchemaName.User, UserSchema);
ModelMgr.getInstance().add({ cls: User });
module.exports.User = User;