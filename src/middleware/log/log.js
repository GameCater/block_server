module.exports = () => {
    const log4js = require("log4js");
    const { config } = require("../../config/config");

    let logConfig = {
        appenders: {
            all: {
                type: "dateFile",
                filename: `${config.log.storePath}/all/`,
                pattern: "yyyy-MM-dd.log",
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: {
                appenders: ["all"],
                level: config.log.minimunLevel
            },
        }
    }
    log4js.configure(logConfig);

    const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"];
    let loggerContext = {};
    const logger = log4js.getLogger("cheese");
    methods.forEach((method, idx) => {
        loggerContext[method] = (msg) => {
            logConfig.appenders.cheese = {
                type: "dateFile",
                filename: `${config.log.storePath}/${method}/`,
                pattern: "yyyy-MM-dd.log",
                alwaysIncludePattern: true
            };
            logConfig.categories.cheese = {
                appenders: ["cheese"],
                level: config.log.minimunLevel
            };
            log4js.configure(logConfig);
            logger[method](msg);
        }
    });
    return async (req, res, next) => {
        req.Logger = loggerContext;
        await next();
    }
}