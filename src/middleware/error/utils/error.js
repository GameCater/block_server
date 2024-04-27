class CustomError extends Error {
    constructor(code, message) {
        super(code + '');
        this.msg = message;
        this.code = code;
    }

    getCodeMsg() {
        return {
            code: this.code,
            msg: this.msg || CodeMsg[this.code] || 'unknown error'
        }
    }
}

class HttpError extends CustomError {
    constructor(code, message) {
        super(code, message);
        if (Object.values(CodeMsg).indexOf(code) == -1) {
            throw new Error('HttpError Constructor: code must be in CodeMsg');
        }
    }
}

const CodeMsg = {
    '200': 'success',
    '400': 'bad request',
    '401': 'unauthorized',
    '403': 'forbidden',
    '404': 'not found',
    '500': 'internal server error',
    '1001': 'custom error msg',
}

module.exports = { CustomError, HttpError, CodeMsg };