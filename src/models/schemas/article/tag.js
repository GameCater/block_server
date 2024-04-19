const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

const TagSchema = new mongoose.Schema({
    name: String,
    date: String,
});

const Tag = mongoose.model(ESchemaName.Tag, TagSchema);
ModelMgr.getInstance().add({ cls: Tag });
module.exports.User = Tag;