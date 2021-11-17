const fs = require('fs');
const utils = require('./utils');
const Zip = require('adm-zip');


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

const start = async () => {

    // let newFile = await loadFile('./files/orig.png');
    // let oldFile = await loadFile('./files/change.png');

    let newFile = await loadFile('./files/new.txt');
    let oldFile = await loadFile('./files/old.txt');


    let patch = [];

    let j = 0;

    for(let i = 0; i < newFile.length; i++) {

        if(newFile.readUInt8(i) !== oldFile.readUInt8(j)) {


            let res = utils.getCommonArray(newFile, oldFile, i, j);
            // break;
            if(res.value === null) {
                // не найдено совпадений вообще
                console.log('end of file');
                break;
            } else {

                patch.push({source: [i, res.index1], content: oldFile.slice(j, res.index2)});

                i = res.index1;
                j = res.index2;
            }

        }

        j++;

    }

    if(oldFile.length > j) {
        // второй файл еще не кончился, значит добавляем остаток к концу
        patch.push({source: [newFile.length, newFile.length], content: oldFile.slice(j, oldFile.length)});
    }

    await createPatchFile('./files/png.patch', patch);

};

const createPatchFile = async (fileName, patches) => {

    let bufferLen = 4;

    patches.forEach(change => {
        bufferLen += change.content.length;
        bufferLen += 8;
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

    let zip = new Zip();

    zip.addFile('file', buf);

    let zipBuf = await zip.toBuffer();

    fs.writeFileSync(fileName, zipBuf);

};


start().then();

