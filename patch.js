const fs = require('fs');

const loadFile = (filename) => {

    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, buf) => {
            if(err) return reject(err);
            resolve(buf);
        });
    });

};

const start = async (patchFile, originalFile, newFile) => {

    let patchBuf = await loadFile(patchFile);
    let originalBuf = await loadFile(originalFile);


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

    fs.writeFileSync(newFile, newBuffer);

};


const applyPatch = (buffer, patch) => {


    // let array = blocksFromBuffer(buffer);

    let start = 0;
    let chunks = [];
    let bytes = 0;

    patch.forEach(change => {

        // console.log(array2String(change.content));

        let b = buffer.slice(start, change.source[0]);
        chunks.push(b);
        if(change.content.length > 0) chunks.push(Buffer.from(change.content));

        start = change.source[1];

        bytes += change.content.length;

    });

    if(start < buffer.length) chunks.push(buffer.slice(start, buffer.length));

    console.log('Patch count =', patch.length);
    console.log('Patch size =', bytes);

    let newBuffer = Buffer.concat(chunks);

    // console.log(newBuffer.toString('utf8'));

    // fs.writeFileSync('./files/123.exe', newBuffer);

};

start('./files/1.patch', './files/hello.exe', './files/new.exe').then();