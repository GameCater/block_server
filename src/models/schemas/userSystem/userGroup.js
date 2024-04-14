const mongoose = require("mongoose");
const { SchemaUtils } = require("../utils");
const { ESchemaName } = require("../names");
const ModelMgr = require("../modelMgr"); 

const UserGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        default: "No description"
    },
    // permissionCode: [
    //     { type: mongoose.Schema.Types.ObjectId, ref: ESchemaName.Permission }
    // ],
    // members: [
    //     { type: mongoose.Schema.Types.ObjectId, ref: ESchemaName.User }
    // ],
});

SchemaUtils.setDefaultData(UserGroupSchema, [
    { name: "user", description: "user"},
    { name: "admin", description: "admin"}
]);

const UserGroup = mongoose.model(ESchemaName.UserGroup, UserGroupSchema);
ModelMgr.getInstance().add(UserGroup);

module.exports.UserGroup = UserGroup;