const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");
const { wrap } = require("../../../utils/response");

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: ""
    },
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

ArticleSchema.statics.st_find = async function (req) {
    const { page, pageSize } = req.query;
    const { id } = req.params;
    const Article = ModelMgr.instance.getModel(ESchemaName.Article);
    let documents;
    let articlesCount = await Article.countDocuments();
    let maxPage = null;
    if (id) {
        documents = await Article.findById(id).sort({ modifiedTime: -1 })
            .populate("tags")
            .populate("author")
            .populate("comments");
    }
    else if (page && pageSize) {
        documents = await Article.find().skip((page - 1) * pageSize).limit(pageSize).sort({ modifiedTime: -1 })
            .populate("tags")
            .populate("author")
            .populate("comments");
        maxPage = Math.ceil(articlesCount / pageSize);
    }
    else {
        documents = await Article.find().sort({ modifiedTime: -1 })
            .populate("tags")
            .populate("author")
            .populate("comments");
    }
    return wrap(200, undefined, {
        data: documents,
        maxPage,
        total: articlesCount
    });
}

const Article = mongoose.model(ESchemaName.Article, ArticleSchema);
ModelMgr.getInstance().add({ cls: Article });
module.exports.User = Article;