const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户表
const userSchema = new Schema({
  // 用户名
  username: String,
  // 密码
  password: {
    type: String,
    select: false, // Schema level强制排除 password
    set(val) {
      return require('bcrypt').hashSync(val, 10);
    }
  },
  // 昵称
  nickname: String,
  // 邮箱
  email: String,
  // 用户头像
  avatar: String,
  // 用户身份
  isAdmin: { type: Boolean, default: false },
});

// 文章表
const articleSchema = new Schema({
  // 标题
  title: String,
  // 简介
  introduction: String,
  // 封面
  cover: String,
  // markdown内容
  body: String,
  // html ?
  content: String,
  // 标签
  tags: Array,
  // 标签id
  tagsID: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  // 更新日期
  date: String,
  // 点击量
  click: Number,
  // 评论数量
  comment: Number,
  // 作者id
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

// 留言表
const messageSchema = new Schema({
  // 内容
  content: String,
  // 时间
  date: String,
  // 评论者id
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
});

// 标签表
const tagSchema = new Schema({
  // 标签名
  name: String,
  // 创建日期
  date: String,
  // 文章id
  aid: { type: Schema.Types.ObjectId, ref: 'Article' },
});

// 评论表
const commentSchema = new Schema({
  // 内容
  content: String,
  // 时间
  date: String,
  // 文章标题
  title: String,
  // 文章id
  aid: { type: Schema.Types.ObjectId, ref: 'Article' },
  // 评论人id
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
});

// 图片表
const photoSchema = new Schema({
  // 内容
  src: String,
  // 时间
  date: String,
  // 地址
  href: String,
  // 上传者
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
});

// 暴露所有文档构造函数
module.exports = {
  User: mongoose.model('User', userSchema),
  Article: mongoose.model('Article', articleSchema),
  Message: mongoose.model('Message', messageSchema),
  Tag: mongoose.model('Tag', tagSchema),
  Comment: mongoose.model('Comment', commentSchema),
  Photo: mongoose.model('Photo', photoSchema),
}