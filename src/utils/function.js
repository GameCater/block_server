class Handler {

    constructor(func, caller, args) {
        this._caller = caller;
        this._func = func;
        this._args = args;
    }

    run() {
        let params = [];
        if (Array.isArray(this._args))
            params = this._args;
        else if (this._args)
            params.push(this._args);
        this._func.apply(this._caller, params);
    }

    runWith(...param) {
        let params = [];
        if (this._args && param) {
            if (Array.isArray(this._args)) {
                params.push(...this._args);
            } else {
                params.push(this._args);
            }
            params.push(...param);
        } else if (this._args) {
            if (Array.isArray(this._args)) {
                params.push(...this._args);
            } else {
                params.push(this._args);
            }
        } else if (param) {
            params.push(...param);
        }

        this._func.apply(this._caller, params);
    }
}

module.exports.Handler = Handler;