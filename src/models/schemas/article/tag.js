const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

/** 标签 */
const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
        default: "",
    },
    modifiedTime: {
        type: Date,
        default: Date.now,
    },
});

SchemaDecorator.getInstance().setDefaultData(TagSchema, {
    name: "默认标签",
});

const Tag = mongoose.model(ESchemaName.Tag, TagSchema);
ModelMgr.getInstance().add({ cls: Tag });
module.exports.User = Tag;