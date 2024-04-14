module.exports = ((app) => {
  let { config } = require("../config/config");
  const mongoose = require("mongoose");
  const host = config.database.host;
  const port = config.database.port;
  const database = config.database.name;
  mongoose.connect(`mongodb://${host}:${port}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) throw err;
    console.log(`database: ${database} connected`);

    const Permission = require("../models/schemas/userSystem/permission");
    const UserGroup = require("../models/schemas/userSystem/userGroup");
    const User = require("../models/schemas/userSystem/user");
    
    const ModelMgr = require("../models/schemas/modelMgr");
    let mgr = ModelMgr.getInstance();
    mgr.init();
  })
})();
