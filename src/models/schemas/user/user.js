const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");
const { CustomError, HttpError } = require("../../../middleware/error/utils/error");
const { wrap } = require("../../../utils/response");

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
                newUser = await User.create([data], { session });
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
        // TODO 返回值
        return wrap(200, undefined, {});
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
        // TODO 返回值
        return wrap(200, undefined, {});
    }
}

UserSchema.statics.st_find = async function (req) {
    const { page, pageSize } = req.query;
    const { id } = req.params;
    const User = ModelMgr.instance.getModel(ESchemaName.User);
    const UserGroup = ModelMgr.instance.getModel(ESchemaName.UserGroup);

    let groups;
    let users;
    let articlesCount = await User.countDocuments();
    if (id) {
        users = await User.find({ _id: id });
    }
    else if (page && pageSize) {
        users = await User.find().skip((page - 1) * pageSize).limit(pageSize);
    }
    else {
        users = await User.find()
    }
    groups = [];
    for await (const doc of users) {
        let result = await UserGroup.call_find({ userId: doc._id });
        groups.push(result);
    }
    return wrap(200, undefined, {
        data: {
            users: users,
            groups: groups
        },
        total: articlesCount
    });
}

const User = mongoose.model(ESchemaName.User, UserSchema);
ModelMgr.getInstance().add({ cls: User });
module.exports.User = User;