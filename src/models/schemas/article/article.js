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

const Article = mongoose.model(ESchemaName.Article, ArticleSchema);
ModelMgr.getInstance().add({ cls: Article });
module.exports.User = Article;