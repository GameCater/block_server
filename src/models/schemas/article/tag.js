const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

const TagSchema = new mongoose.Schema({
    name: String,
    date: String,
});

const User = mongoose.model(ESchemaName.User, UserSchema);
ModelMgr.getInstance().add({ cls: User });

module.exports.User = User;