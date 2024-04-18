const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

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
});

SchemaDecorator.getInstance().setDefaultData(UserGroupSchema, [
    { name: "user", description: "user"},
    { name: "admin", description: "admin"}
]);

const UserGroup = mongoose.model(ESchemaName.UserGroup, UserGroupSchema);
ModelMgr.getInstance().add({ cls: UserGroup });

module.exports.UserGroup = UserGroup;