const fs = require('fs');
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

const patch = async (oldFilePath, patchFilePath, newFilePath, isZip = false) => {

    let originalBuf = await loadFile(oldFilePath);
    let patchBuf = null;

    if(isZip) {
        let zip = new Zip(patchFilePath);
        patchBuf = zip.readFile('file');
    } else {
        patchBuf = await loadFile(patchFilePath);
    }


    // parse patch file
    let start = 0;
    let chunks = [];
    // let patches = [];
    let count = patchBuf.readUInt32LE(0);
    let i = 4;
    for(let n = 0; n < count; n++) {

        let v1 = patchBuf.readUInt32LE(i); i += 4;
        let v2 = patchBuf.readUInt32LE(i); i += 4;
        let len = patchBuf.readUInt32LE(i); i += 4;
        let content = Buffer.alloc(len);
        patchBuf.copy(content, 0, i, i + len); i += len;

        // console.log(content.toString('utf8'));

        chunks.push(originalBuf.slice(start, v1));
        if(len > 0) chunks.push(content);
        start = v2;


        // patches.push({
        //     source: [v1, v2],
        //     content: content
        // });

    }
    if(start < originalBuf.length) chunks.push(originalBuf.slice(start, originalBuf.length));

    let newBuffer = Buffer.concat(chunks);

    fs.writeFileSync(newFilePath, newBuffer);

    return {
        crc32: CRC32.buf(newBuffer),
    }

};

module.exports = patch;

// patch('./files/old.txt', './files/1.patch', './files/result.txt').then();