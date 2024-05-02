function getFileType(minetype) {
    return minetype.split('/')[0];
}

module.exports.getFileType = getFileType;