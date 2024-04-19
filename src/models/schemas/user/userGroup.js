const mongoose = require("mongoose");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");
const { SchemaDecorator } = require("../../schemaDecorator");

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

SchemaDecorator.getInstance().setDefaultData(UserGroupSchema, {
    "userId": ESchemaName.User + "_username_root",
    "groupId": ESchemaName.Group + "_name_admin",
    "isCustom": true,
});

const UserGroup = mongoose.model(ESchemaName.UserGroup, UserGroupSchema);
ModelMgr.getInstance().add({ cls: UserGroup, priority: 2 });
module.exports.UserGroup = UserGroup;