const mongoose = require("mongoose");
const { SchemaDecorator } = require("../../schemaDecorator");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");

const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        default: "",
    },
    code: {
        type: Number,
        unique: true,
    }
});

SchemaDecorator.getInstance().setDefaultData(PermissionSchema, [
    { name: "visit", description: "仅可访问", code: 0 },
    { name: "edit", description: "可编辑", code: 10 } 
]);

const Permission = mongoose.model(ESchemaName.Permission, PermissionSchema);
ModelMgr.getInstance().add({ cls: Permission });
module.exports.Permission = Permission;