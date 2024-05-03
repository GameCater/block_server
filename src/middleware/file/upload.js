const multer = require('multer');
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require("fs");
const config = require('../../config');
const { getFileType, ascii2utf8 } = require("../../utils/fileUtil");
const md5 = require('md5');

const storage = multer.memoryStorage()

// 静态文件存储规则
// const storage = multer.diskStorage({
//   destination: async function (req, file, cb) {
//     const filepathBase = config.static.path;
//     const filepath = path.join(filepathBase, getFileType(file.mimetype));
//     if (!fs.existsSync(filepath)) {
//       fs.mkdirSync(filepath);
//     }
//     cb(null, filepath);
//   },
//   filename: function (req, file, cb) {
//     const filename = uuid().replaceAll('-', '') + "@" + file.originalname + "@" + path.extname(file.originalname);
//     cb(null, filename);
//   }
// });



// 文件简单过滤规则
const filter = (req, file, cb) => {
    cb(null, true);
}

const option = {
    storage,
    fileFilter: filter
}

module.exports = multer(option);