class CustomError extends Error {
    constructor(code, message) {
        super(code, { message: message || 'unknown error' });
        this.code = code;
        this.msg = message;
        this.status = 500;
    }

    getCodeMsg() {
        return {
            code: this.code,
            msg: this.msg || StatusMsg[this.status] || 'unknown error'
        }
    }
}

class HttpError extends CustomError {
    constructor(code, message) {
        super(code, message);
    }
}

const StatusMsg = {
    200: 'success',
    400: 'bad request',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not found',
    500: 'internal server error',

    'success': 200,
    'bad request': 400,
    'unauthorized': 401,
    'forbidden': 403,
    'not found': 404,
    'internal server error': 500,
}

module.exports = { CustomError, HttpError, CodeMsg: StatusMsg };