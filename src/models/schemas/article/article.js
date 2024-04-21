const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: ""
    },
    cover: String,
    markdown: {
        type: String,
    },
    html: {
        type: String,
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ESchemaName.Tag
        }
    ],
    modifiedTime: {
        type: Date,
    },
    click: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.User
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ESchemaName.Comment
        }
    ]
});

const Article = mongoose.model(ESchemaName.Article, ArticleSchema);
ModelMgr.getInstance().add({ cls: Article });
module.exports.User = Article;