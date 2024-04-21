const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

/** 评论 */
const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.User,
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.Article
    },
    replys: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ESchemaName.Comment
        }
    ],
    belong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.Comment
    },
    like: Number,
});

const Comment = mongoose.model(ESchemaName.Comment, CommentSchema);
ModelMgr.getInstance().add({ cls: Comment });
module.exports.Comment = Comment;