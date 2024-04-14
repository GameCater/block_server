const fs = require("fs");
const { Handler } = require("../../utils/function");

class ModelMgr {
    static instance = null;
    
    constructor() {
        this._models = {};
        this._initedCount = 0;
        this._needInitCount = 0;
    }

    static getInstance() {
        if (ModelMgr.instance == null) {
            ModelMgr.instance = new ModelMgr();
        }
        return ModelMgr.instance;
    }

    add(modelCls) {
        this._models[modelCls.modelName] = {
            isInited: false,
            deleted: false,
            cls: modelCls,
        }
    }

    init() {
        fs.readFile("./modelInitializeFlag.json", "utf8", (err, data) => {
            if (err) {
                console.log("modelInitializeFlag.json read failed!");
                this._initModels();
            } else {
                let flags = JSON.parse(data);
                for (let key in flags) {
                    let model = this._models[key];
                    if (model) {
                        model.isInited = flags[key].isInited;
                    } else {
                        let modelInfo = {
                            isInited: flags[key].isInited,
                            deleted: true,
                            cls: null,
                        }
                        this._models[key] = modelInfo;
                    }
                }
                this._initModels();
            }
        });
    }

    _initModels() {
        for (let modelClsName in this._models) {
            let model = this._models[modelClsName];
            if (!model.isInited && !model.deleted) {
                let modelCls = model.cls;
                modelCls.firstSetup().apply(modelCls, [new Handler(this._onModelInitedSuccess, this, model)]);
            }
        }

        let count = 0;
        for (let modelClsName in this._models) {
            let model = this._models[modelClsName];
            if (!model.deleted && !model.isInited) {
                count++;
            }
        }
        this._needInitCount = count;
    }

    _onModelInitedSuccess(model) {
        model.isInited = true;
        this._initedCount ++;
        this._checkIsComplete();
    }

    _checkIsComplete() {
        if (this._initedCount == this._needInitCount) {
            this._updateLocalRecords();
        }
    }

    _updateLocalRecords() {
        let dataToStore = {};
        for (let modelClsName in this._models) {
            let model = this._models[modelClsName];
            let data = {
                isInited: model.isInited,
            }
            dataToStore[modelClsName] = data;
        }
        let record = JSON.stringify(dataToStore);
        fs.writeFile("./modelInitializeFlag.json", record, (err) => {
            if (err) console.log("modelInitializeFlag.json write failed!");
        });
    }
}

module.exports = ModelMgr;