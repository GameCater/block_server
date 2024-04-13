const multer = require('multer');
const { uuid } = require('uuidv4');
const path = require('path');

// 配置文件上传规则
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, uuid().replaceAll('-', '') + path.extname(file.originalname));
  }
});

module.exports = multer({ storage: storage });