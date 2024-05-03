const path = require('path');
const { v4 } = require('uuid');
const fs = require('fs');
const md5 = require('md5');
const config = require('../../config');
const { getFileType } = require('../../utils/fileUtil');
const { getFileInfoMap, updateFileInfoMap } = require('./init');
const { ascii2utf8 } = require('../../utils/fileUtil');

module.exports = (req, res, next) => {
    if (req.files && req.files.length) {
        for (let i = 0; i < req.files.length; i++) {
            let file = req.files[i];

            fixNameEncodeProblem(file);
            file.filename = getFileName(file);
            file.filepath = getFileStorePath(file);

            const { canStore, fileInfo } = storeFile(file);

            if (canStore) {
                let ws = fs.createWriteStream(file.filepath);
                ws.write(file.buffer, (err) => {
                    if (err) next(err);
                });
                ws.on('finish', () => {
                    req.Logger.info(`file ${file.filename} store success`);
                    delete file.buffer;
                });
                ws.end();
            }
            file.info = fileInfo;
        }
        next();
    }
}

let fileInfoMap = getFileInfoMap();

function storeFile(file) {
    let canStore = true;
    let fileType = getFileType(file.mimetype);
    let hash = getFileContentHash(file);

    let fileInfo;
    if (fileInfoMap.has(fileType)) {
        let recordDic = fileInfoMap.get(fileType);
        if (recordDic[hash]) {
            canStore = false;
            fileInfo = recordDic[hash];
        }
        else {
            canStore = true;
            fileInfo = {
                name: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                path: file.filepath,
            };
            updateFileInfoMap(fileType, hash, fileInfo);
        }
    }
    else {
        canStore = true;
        fileInfo = {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            path: file.filepath,
        };
        updateFileInfoMap(fileType, hash, fileInfo);
    }

    return {
        canStore,
        fileInfo,
    };
}

function fixNameEncodeProblem(file) {
    let originName = ascii2utf8(file.originalname);
    file.originalname = originName;
}

function getFileContentHash(file) {
    return md5(file.buffer);
}

function getFileName(file) {
    const name = file.originalname.split('.')[0];
    const filename = v4().replaceAll('-', '') + "@" + name + "@" + path.extname(file.originalname);
    return filename;
}

function getFileStorePath(file) {
    const filepathBase = config.static.path;
    const fileDir = path.join(filepathBase, getFileType(file.mimetype));
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir);
    }
    const filePath = path.join(fileDir, file.filename);
    return filePath;
}