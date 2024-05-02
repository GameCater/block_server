function wrap(code, message, data) {
    let wrapped = {};
    wrapped.code = code;
    if (message) {
        wrapped.message = message;
    }
    else if (data) {
        wrapped.payload = data;
    }
    return wrapped;
}

module.exports.wrap = wrap;