const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

const ArticleSchema = new mongoose.Schema({
    title: String,
    introduction: String,
    // 封面
    cover: String,
    // md内容
    body: String,
    // md内容html格式
    content: String,
    
});

SchemaDecorator.getInstance().setDefaultData(UserSchema, {
    username: "root",
    password: "123456",
});

const User = mongoose.model(ESchemaName.User, UserSchema);
ModelMgr.getInstance().add({ cls: User });

module.exports.User = User;