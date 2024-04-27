module.exports = ((app) => {
    let config = require("../config");

    const mongoose = require("mongoose");
    const fs = require("fs");
    const path = require("path");

    mongoose.set("strictQuery", false);

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
        let schemaInitConfig = config.database.schemasInitConfig;
        _importRequiredSchemaFiles(schemaRootPath, schemaInitConfig);
        
        const { ModelMgr } = require("../models/modelMgr");
        ModelMgr.getInstance().init();
    }

    function _importRequiredSchemaFiles(schemaRootPath, schemaInitConfig) {

        let fileNames = [];
        fs.readdirSync(schemaRootPath).forEach(fileName => {
            fileNames.push(fileName);    
        });

        let schemasNeedInit = [];
        if (fileNames.indexOf(schemaInitConfig)) {
            let configPath = path.join(schemaRootPath, schemaInitConfig);
            if (fs.existsSync(configPath)) {
                let config = require(configPath);
                schemasNeedInit = config.import;
            }
        }

        if (schemasNeedInit.length > 0) {
            schemasNeedInit.forEach(schemaName => {
                let schemaPath = path.join(schemaRootPath, schemaName);
                require(schemaPath);
            });
        }
    }
});
