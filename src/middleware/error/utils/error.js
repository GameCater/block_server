/** 服务器自定义错误，不向客户端提供详细信息 */
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

/** HTTP错误，向客户端提供较为详细的信息 */
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
    1201: 'custom error',

    'custom error': 1201,
    'success': 200,
    'bad request': 400,
    'unauthorized': 401,
    'forbidden': 403,
    'not found': 404,
    'internal server error': 500,
}

module.exports = { CustomError, HttpError, CodeMsg: StatusMsg };