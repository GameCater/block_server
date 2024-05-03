const multer = require('multer');
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require("fs");
const config = require('../../config');
const { getFileType } = require("../../utils/fileUtil");

// 静态文件存储规则
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const filepathBase = config.static.path;
    const filepath = path.join(filepathBase, getFileType(file.mimetype));
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    cb(null, filepath);
  },
  filename: function (req, file, cb) {
    let originName = Buffer.from(file.originalname, "ascii").toString("utf-8");
    file.originalname = originName;
    const filename = uuid().replaceAll('-', '') + path.extname(file.originalname);
    cb(null, filename);
  }
});

const option = {
  storage,
  fileFilter: function (req, file, cb) {
    if (file && file.originalname.endsWith(".js")) {
      cb(null, false);
    }
    else
      cb(null, true);
  }
}

module.exports = multer(option);