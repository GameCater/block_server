class SchemaUtils {
    static setDefaultData(schemaCls, data) {
        schemaCls.statics.firstSetup = function () {
            return function (handler) {
                let targets = [];
                if (Array.isArray(data)) {
                    targets.push(...data);
                } else {
                    targets.push(data);
                }

                this.create(targets, function (err, obj) {
                    if (err) console.log(err);
                    handler && handler.run();
                    console.log(obj);
                })
            };
        }
    }
}

module.exports.SchemaUtils = SchemaUtils;