const fs = require("fs");
const { Handler } = require("../../utils/function");
const BaseEventEmitter = require("./baseEventEmitter");

class ModelMgr {
    static instance = null;
    
    constructor() {
        this._models = {};
        this._initedCount = 0;
        this._needInitCount = 0;

        this.emitter = new BaseEventEmitter();
    }

    static getInstance() {
        if (ModelMgr.instance == null) {
            ModelMgr.instance = new ModelMgr();
        }
        return ModelMgr.instance;
    }

    getModel(modelName) {
        return this._models[modelName]?.cls;
    }

    add(modelInfo) {
        let cls = modelInfo.cls;
        this._models[cls.modelName] = {
            isInited: false,
            deleted: false,
            cls,
            priority: modelInfo.priority || 0,
        };
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
                            priority: 0,
                        }
                        this._models[key] = modelInfo;
                    }
                }
                this._initModels();
            }
        });
    }

    async _initModels() {
        this._preInit();

        let sorted = this._getSortedModels();
        for (let i = 0; i < sorted.length; i ++) {
            let model = sorted[i];
            if (!model.isInited && !model.deleted) {
                let modelCls = model.cls;
                let haveSetUpFunc = modelCls.firstSetup;
                if (haveSetUpFunc) {
                    let cbHandler = new Handler(this._onModelInitedSuccess, this, model);
                    modelCls.firstSetup().apply(modelCls, [cbHandler]);
                } else {
                    this._onModelInitedSuccess(model);
                }
            }
        }
    }

    _preInit() {
        this._totalModelPrepareToInit();
    }

    _getSortedModels() {
        let models = [];
        for (let modelClsName in this._models) {
            let model = this._models[modelClsName];
            models.push(model);
        }
        models.sort((a, b) => a.priority - b.priority);
        return models;
    }

    _totalModelPrepareToInit() {
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
            this.emitter.emit(ModelMgrEvents.AllModelInited);
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

class ModelMgrEvents {
    static AllModelInited = "ModelMgrEvents_AllModelInited";
}

module.exports.ModelMgr = ModelMgr;
module.exports.ModelMgrEvents = ModelMgrEvents;