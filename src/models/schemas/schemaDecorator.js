const { ModelMgr, ModelMgrEvents } = require("./modelMgr");

class SchemaDecorator {
    static instance = null;

    constructor () {
        this._primaryData = [];
        ModelMgr.getInstance().emitter.on(ModelMgrEvents.AllModelInited, () => { this._processData.apply(this); });
    }

    static getInstance() {
        if (SchemaDecorator.instance === null) {
            SchemaDecorator.instance = new SchemaDecorator();
        }
        return SchemaDecorator.instance;
    }

    async _processData() {
        let dependedData = [];
        let delayedData = [];

        // special format type  modelName_att_value
        for (let i = 0; i < this._primaryData.length; i ++) {
            let d = this._primaryData[i];
            let isCustom = d.isCustom;
            if (isCustom) {
                delayedData.push(d);
            } else {
                dependedData.push(d);
            }
        }
        
        Promise.all(
            dependedData.map(async (data) => {
                let callerType = data._callerType;
                delete data._callerType;
                await callerType.create(data);
            })
        ).then(() => {
            delayedData.map(async (data) => {
                let promises = [];
                for (let key in data) {
                    if (key === 'isCustom' || key === "_callerType") continue;
                    let specailFormat = data[key];
                    let modelName = specailFormat.split('_')[0];
                    let attribute = specailFormat.split('_')[1];
                    let value = specailFormat.split('_')[2];
                    let modelCls = ModelMgr.instance.getModel(modelName);

                    if (modelCls) {
                        let toFind = { [attribute] : value };
                        let query = modelCls.find(toFind);
                        let promise = query.exec();
                        promises.push(promise.then(async function (docs) {
                            delete data.isCustom;
                            data[key] = docs[0]._id;
                        }));
                    }
                }
                Promise.all(promises).then(() => {
                    let callerType = data._callerType;
                    delete data._callerType;
                    callerType.create(data);
                });
            });
        })
    }
    
    setDefaultData(schemaCls, data) {
        const that = this;
        const firstSetupFunc = function () {
            return async function (handler) {
                let datas = [];
                if (Array.isArray(data)) {
                    data.forEach(d => {
                        d._callerType = this;
                    });
                    datas.push(...data);
                } else {
                    data._callerType = this;
                    datas.push(data);
                }
                that._primaryData.push(...datas);
                handler && handler.run();
            };
        }
        schemaCls.statics.firstSetup = firstSetupFunc;
    }
}

module.exports.SchemaDecorator = SchemaDecorator;