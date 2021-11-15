const fs = require('fs');
const utils = require('./utils');


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

    let buf1 = await loadFile('./files/file.txt');
    let buf2 = await loadFile('./files/remove.txt');
    // let buf2 = await loadFile('./files/changed.txt');


    let newFile = blocksFromBuffer(buf1);
    let oldFile = blocksFromBuffer(buf2);

    // console.log(newFile);
    // console.log(oldFile);

    let patch = [];

    let j = 0;

    for(let i = 0; i < newFile.length; i++) {

        if(newFile[i] !== oldFile[j]) {


            let res = utils.getCommonArray(newFile, oldFile, i, j);
            // break;
            if(res.value === null) {
                // не найдено совпадений вообще
                console.log('end of file');
                break;
            } else {

                let content = oldFile.slice(j, res.index2);

                patch.push({source: [i, res.index1], content: content});

                i = res.index1;
                j = res.index2;
            }

        }

        j++;

    }

    if(oldFile.length > j) {
        // второй файл еще не кончился, значит добавляем остаток к концу
        let content = oldFile.slice(j, oldFile.length);
        patch.push({source: [newFile.length, newFile.length], content: content});
    }

    applyPatch(buf1, patch);

};

const applyPatch = (buffer, patch) => {


    // let array = blocksFromBuffer(buffer);

    let start = 0;
    let chunks = [];
    let bytes = 0;

    patch.forEach(change => {

        console.log(array2String(change.content));

        let b = buffer.slice(start, change.source[0]);
        chunks.push(b);
        if(change.content.length > 0) chunks.push(Buffer.from(change.content));

        start = change.source[1];

        bytes += change.content.length;

    });

    if(start < buffer.length) chunks.push(buffer.slice(start, buffer.length));

    console.log('Patch size =', bytes);

    let newBuffer = Buffer.concat(chunks);

    console.log(newBuffer.toString('utf8'));

};



start().then();

