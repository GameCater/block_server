function assemble(param, out = []) {
    if (!param) return out;
    if (param instanceof Array) {
        param.forEach(item => {
            if (item instanceof Array) {
                out.concat(assemble(item, out));
            } else {
                out.push(item);
            }
        })
    } else {
        out.push(param);
    }
}

module.exports = {
    assemble,
}