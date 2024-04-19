const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

const GroupSchema = new mongoose.Schema({
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

SchemaDecorator.getInstance().setDefaultData(GroupSchema, [
    { name: "user", description: "user"},
    { name: "admin", description: "admin"}
]);

const Group = mongoose.model(ESchemaName.Group, GroupSchema);
ModelMgr.getInstance().add({ cls: Group });

module.exports.Group = Group;