module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const { Article, Tag, Comment } = require('../models/models');

  // 文章列表
  router.get('/article/list', async (req, res) => {
    try {
      const pageSize = Number(req.query.pageSize) || 10,
            page = Number(req.query.page) || 1,
            start = (page - 1) * pageSize;
      const documents = await Article.find().skip(start).limit(pageSize).populate({ path: 'tags' });
      const total = await Article.find().countDocuments();
      const maxPage = Math.ceil(total / pageSize);
      res.json({ data: documents, total, maxPage });
    } catch (error) {
      console.log(error.message);
    }
  })

  // 搜索文章
  router.get('/article/search', async (req, res) => {
    try {
      let { keyword, value, page, pageSize } = req.query;
      page = Number(page) || 1;
      pageSize = Number(pageSize) || 5;
      const re = new RegExp(value, 'i');
      const start = (page - 1) * pageSize;
  
      let filterOption = {};
      switch (keyword) {
        case 'title':
          filterOption = { title: re };
          break;
        case 'date':
          const nextDay = value + 'T24:00:00'; // 日期不是时间戳
          filterOption = { date: { $gte: value, $lt: nextDay } };
          break;
      }
      const documents = await Article.find(filterOption).sort({ date: -1 }).skip(start).limit(pageSize).populate({ path: 'tags' });
      const total = await Article.find(filterOption).countDocuments();
      const maxPage = Math.ceil(total / pageSize);
      res.send({ data: documents, maxPage, total });
    } catch (error) {
      console.log(error.message);
    }
  })

  // 文章详情
  router.get('/article/:id', async (req, res) => {
    const data = await Article.findById(req.params.id).populate({ path: 'tags' });
    res.json({ data });
  })

  // 标签列表
  router.get('/tag/list', async (req, res) => {
    try {
      const documents = await Tag.find().populate('aid');
      res.json({ data: documents });
    } catch (error) {
      console.log(error);
    }
  })

  // 新增评论
  router.post('/comment/create', async (req, res) => {
    try {
      const model = await Comment.create(req.body);
      res.send(model);
    } catch (error) {
      console.log(error);
    }
  })

  // 评论列表
  router.get('/comment/list/:id', async (req, res) => {
    try {
      const documents = await Comment.find({ aid: req.params.id }).sort({ date: -1 }).populate('uid');
      res.json({ data: documents });
    } catch (error) {
      console.log(error);
    }
  })
  app.use('/web/api', router);
}