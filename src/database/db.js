module.exports = ((app) => {
    let { config } = require("../config/config");
    const mongoose = require("mongoose");
    const fs = require("fs");
    const path = require("path");

    const host = config.database.host;
    const port = config.database.port;
    const database = config.database.name;
    mongoose.connect(`mongodb://${host}:${port}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) throw err;
        console.log(`database: ${database} connected`);

        let schemaRootPath = config.database.schemasUrl;
        fs.readdirSync(schemaRootPath).forEach(p => {
            let schemaSubDirPath = path.join(schemaRootPath, p);
            fs.readdirSync(schemaSubDirPath).forEach(s => {
                let schemaPath = path.join(schemaSubDirPath, s);
                require(schemaPath);
            });
        });

        const { ModelMgr } = require("../models/modelMgr");
        ModelMgr.getInstance().init();
    })
})();
