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

const start = async () => {

    let newFile = new Uint8Array(await loadFile('./files/old.txt'));
    let oldFile = new Uint8Array(await loadFile('./files/new.txt'));


    let crc = CRC32.buf(newFile);
    console.log('CRC32 of final file', crc);


    let patch = [];

    let j = 0;


    // todo очень медленный поиск в bmp, возможно использовать массив байтов, надо тестить

    for(let i = 0; i < newFile.length; i++) {

        // todo ошибка если финальный файл сильно меньше исходного
        if(newFile[i] !== oldFile[j]) {


            let res = utils.getCommonArray2(newFile, oldFile, i, j);
            // break;
            if(!res.success) {
                // не найдено совпадений вообще
                console.log('end of file');
                break;
            } else {

                patch.push({
                    source: [i, res.index1],
                    content: Buffer.from(oldFile.slice(j, res.index2).buffer)
                });

                i = res.index1;
                j = res.index2;
            }

        }

        j++;

    }

    if(oldFile.length > j) {
        // второй файл еще не кончился, значит добавляем остаток к концу
        patch.push({
            source: [newFile.length, newFile.length],
            content: Buffer.from(oldFile.slice(j, oldFile.length).buffer)
        });
    }


    console.log(patch);

    await createPatchFile('./files/1.patch', patch);

};

const createPatchFile = async (fileName, patches) => {

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

    let useZip = false;

    if(useZip) {
        let zip = new Zip();
        zip.addFile('file', buf);
        let zipBuf = await zip.toBuffer();
        fs.writeFileSync(fileName, zipBuf);
    } else {
        fs.writeFileSync(fileName, buf);
    }

};


start().then();

