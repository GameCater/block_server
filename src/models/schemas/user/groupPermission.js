const mongoose = require("mongoose");
const { ESchemaName } = require("../../names");
const { ModelMgr } = require("../../modelMgr");
const { SchemaDecorator } = require("../../schemaDecorator");

const GroupPermissionSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.Group,
        required: true,
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ESchemaName.Permission,
        required: true,
    }
});

SchemaDecorator.getInstance().setDefaultData(GroupPermissionSchema, {
    "groupId": ESchemaName.Group + "_name_admin", 
    "permissionId": ESchemaName.Permission + "_name_edit",
    "isCustom": true,
});

const GroupPermission = mongoose.model(ESchemaName.GroupPermission, GroupPermissionSchema);
ModelMgr.getInstance().add({ cls: GroupPermission, priority: 1 });
module.exports.GroupPermission = GroupPermission;