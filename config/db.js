const { User } = require("../models/models");

module.exports = ((app) => {
  const mongoose = require("mongoose");
  const host = '127.0.0.1';
  const port = 27017;
  const database = 'blog';
  mongoose.connect(`mongodb://${host}:${port}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) throw err;
    console.log(`database: ${database} connected`);
  })
})();
