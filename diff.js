const fs = require('fs');
const utils = require('./utils');
const Zip = require('adm-zip');
const CRC32 = require('crc-32');


const loadFile = (filename) => {

    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, buf) => {
            if(err) return reject(err);
            resolve(buf);
        });
    });

};

const blockToString = (b) => {
    let s = b.toString('hex');
    return s + '0'.repeat(32 - s.length);
};

const blocksFromBuffer = (buf) => {
    let blocks = [];
    for(let i = 0; i < buf.length; i++) {
        blocks.push(buf.readUInt8(i));
    }
    return blocks;
};

const array2String = (arr) => {
    return Buffer.from(arr).toString('utf8');
};

const diff = async (oldFilePath, newFilePath, patchFilePath, isZip = false) => {

    let oldFile = new Uint8Array(await loadFile(oldFilePath));
    let newFile = new Uint8Array(await loadFile(newFilePath));

    let crc = CRC32.buf(newFile);

    let patch = [];
    let j = 0;


    for(let i = 0; i < oldFile.length; i++) {

        // todo ошибка если финальный файл сильно меньше исходного
        if(oldFile[i] !== newFile[j]) {

            let res = utils.findSequence(oldFile, newFile, i, j);

            patch.push({
                source: [i, res.index1],
                content: Buffer.from(newFile.slice(j, res.index2).buffer)
            });

            i = res.index1;
            j = res.index2;

        }

        j++;

    }

    if(newFile.length > j) {
        // второй файл еще не кончился, значит добавляем остаток к концу
        // console.log('get the end');
        patch.push({
            source: [oldFile.length, oldFile.length],
            content: Buffer.from(newFile.slice(j, newFile.length).buffer)
        });
    }


    // console.log(patch);

    let patchBuffer = await createPatchFile(patchFilePath, patch, isZip);

    // return stat info
    return {
        crc32: crc,
        changesCount: patch.length,
        changesSize: patch.reduce((a, c) => a + c.content.length, 0),
        patchFileSize: patchBuffer.length,
    }

};

const createPatchFile = async (fileName, patches, isZip) => {

    let bufferLen = 4;

    patches.forEach(change => {
        bufferLen += change.content.length;
        bufferLen += 12;
    });

    // console.log(patches);

    let buf = Buffer.alloc(bufferLen);

    let i = 0;
    buf.writeUInt32LE(patches.length, i); i += 4;
    patches.forEach(change => {
        buf.writeUInt32LE(change.source[0], i);         i += 4;
        buf.writeUInt32LE(change.source[1], i);         i += 4;
        buf.writeUInt32LE(change.content.length, i);    i += 4;
        change.content.copy(buf, i, 0);                 i += change.content.length;
    });

    if(isZip) {
        let zip = new Zip();
        zip.addFile('file', buf);
        let zipBuf = await zip.toBuffer();
        fs.writeFileSync(fileName, zipBuf);
        return zipBuf;
    } else {
        fs.writeFileSync(fileName, buf);
        return buf;
    }

};

module.exports = diff;

// diff('./files/old.txt', './files/new.txt', './files/1.patch', false).then();

