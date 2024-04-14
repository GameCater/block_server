const mongoose = require("mongoose");
const { SchemaUtils } = require("../utils");
const { ESchemaName } = require("../names");
const ModelMgr = require("../modelMgr"); 

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    userGroup: {
        type: Array,
        default: [],
    },
    email: {
        type: String,
    },
    nickname: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
    registTime: {
        type: Date,
    }
});

SchemaUtils.setDefaultData(UserSchema, {
    username: "root",
    password: "123456",
});

const User = mongoose.model(ESchemaName.User, UserSchema);
ModelMgr.getInstance().add(User);

module.exports.User = User;