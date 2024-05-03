const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const config = require('../../config');

// ---
// name
// size
// path
// type
// ---
let fileInfoMap = new Map();

// 不同文件类型会分类放在不同的目录下
function handleFileTypeDir(type) {
    const subDirPath = path.join(config.static.path, type);
    fs.readdir(subDirPath, (err, files) => {
        if (err) { console.log(err); return; }
        files.forEach(file => {
            handleFile(file, subDirPath);
        })
    });
}

// 处理具体的文件
function handleFile(file, dirPath) {
    const type = dirPath.split(path.sep).pop();
    const filePath = path.join(dirPath, file);
    let fileInfo = null;
    fs.stat(filePath, (err, stats) => {
        if (err) { console.log(err); return; }
        const name = file.split('@')[1];
        fileInfo = {
            name,
            size: stats.size,
            type: type,
            path: filePath
        }
    });

    let readStream = fs.createReadStream(filePath);
    let buffer = [];
    readStream.on('data', data => {
        buffer.push(data);
    });
    readStream.on('end', () => {
        let hash = md5(Buffer.concat(buffer));
        if (fileInfoMap.has(type)) {
            let recordDic = fileInfoMap.get(type);
            recordDic[hash] = fileInfo;
        }
        else {
            fileInfoMap.set(type, { [hash]: fileInfo });
        }
    });
    readStream.on('error', err => {
        console.log(err);
    });
}

(function buildFileInfoMap() {
    fs.readdir(config.static.path, (err, files) => {
        if (err) { console.log(err); return; }
        files.forEach(subDir => {
            handleFileTypeDir(subDir);
        })
    })
})();


function getFileInfoMap() {
    return fileInfoMap;
}

function updateFileInfoMap(type, hash, fileInfo) {
    if (fileInfoMap.has(type)) {
        let recordDic = fileInfoMap.get(type);
        recordDic[hash] = fileInfo;
    }
    else {
        fileInfoMap.set(type, { [hash]: fileInfo });
    }
}

module.exports = {
    getFileInfoMap,
    updateFileInfoMap
}