function getFileType(minetype) {
    return minetype.split('/')[0];
}

function ascii2utf8(str) {
    return Buffer.from(str, "ascii").toString("utf-8");
}

module.exports = {
    getFileType: getFileType,
    ascii2utf8: ascii2utf8
}