const mongoose = require("mongoose");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");
const { SchemaDecorator } = require("../../schemaDecorator");
const { wrap } = require("../../../utils/response");

/** 用户&组 关系 */
const UserGroupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.User,
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.Group,
        required: true,
    }
});

UserGroupSchema.statics.call_find = async function (params) {
    const { userId, groupId } = params;
    const UserGroup = ModelMgr.instance.getModel(ESchemaName.UserGroup);
    let documents;
    if (userId && groupId) {
        documents = await UserGroup.findOne({ userId, groupId })
            .populate("userId")
            .populate("groupId");
    }
    else if (userId) {
        documents = await UserGroup.find({ userId })
            .populate("userId")
            .populate("groupId");
    }
    else if (groupId) {
        documents = await UserGroup.find({ groupId })
            .populate("userId")
            .populate("groupId");
    }
    else {
        documents = await UserGroup.find()
            .populate("userId")
            .populate("groupId");
    }
    return documents;
}

UserGroupSchema.statics.st_find = async function (req) {
    const UserGroup = ModelMgr.instance.getModel(ESchemaName.UserGroup);
    let documents;
    let total = await UserGroup.countDocuments();
    const { page, pageSize } = req.query;
    const { id } = req.params;
    if (id) {
        documents = await UserGroup.findById(id)
            .populate("userId")
            .populate("groupId")
    }
    else if (page && pageSize) {
        documents = await UserGroup.find().skip((page - 1) * pageSize).limit(pageSize)
            .populate("userId")
            .populate("groupId")
    }
    else {
        documents = await UserGroup.find()
            .populate("userId")
            .populate("groupId")
    }
    return wrap(200, undefined, {
        data: documents,
        total: total
    });
}

SchemaDecorator.getInstance().setDefaultData(UserGroupSchema, {
    "userId": ESchemaName.User + "_username_root",
    "groupId": ESchemaName.Group + "_name_admin",
    "isCustom": true,
});

const UserGroup = mongoose.model(ESchemaName.UserGroup, UserGroupSchema);
ModelMgr.getInstance().add({ cls: UserGroup, priority: 2 });
module.exports.UserGroup = UserGroup;