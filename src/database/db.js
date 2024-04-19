module.exports = ((app) => {
    let { config } = require("../config/config");
    const mongoose = require("mongoose");
    const fs = require("fs");
    const path = require("path");

    const host = config.database.host;
    const port = config.database.port;
    const database = config.database.name;
    const connection = mongoose.connect(`mongodb://${host}:${port}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(db => {
        console.log(`database: ${database} connected`);

        _initModelManager();
    });

    function _initModelManager() {
        let schemaRootPath = config.database.schemasUrl;
        _importAllSchemaFiles(schemaRootPath);
        
        const { ModelMgr } = require("../models/modelMgr");
        ModelMgr.getInstance().init();
    }

    function _importAllSchemaFiles(schemaRootPath) {
        fs.readdirSync(schemaRootPath).forEach(p => {
            let schemaSubDirPath = path.join(schemaRootPath, p);
            fs.readdirSync(schemaSubDirPath).forEach(s => {
                let schemaPath = path.join(schemaSubDirPath, s);
                require(schemaPath);
            });
        });
    }
})();
