const fs = require('fs');


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
    let blocksCount = Math.ceil(buf.length / 16);
    for(let i = 0; i < blocksCount; i++) {
        let start = i * 16;
        let block = buf.slice(start, start + 16);
        blocks.push(blockToString(block));
    }
    return blocks;
}

const start = async () => {

    let buf1 = await loadFile('./files/file.bin');
    let buf2 = await loadFile('./files/change.bin');


    let target = blocksFromBuffer(buf1);
    let destination = blocksFromBuffer(buf2);

    // console.log(blocks1);
    // console.log(blocks2);

    let offset = 0;

    target.forEach((block, i) => {

        let j = i + offset;
        let tmp = [];

        if(block !== destination[j]) {
            console.log(`Change block ${i}. Old=${block} New=${destination[i]}`);
        }

        // while (block !== destination[j])
        // {
        //     tmp.push([j, destination[j]]);
        //
        //     if(target[i+1] === destination[j]) break;
        //
        //     j++;
        //     offset = j - i;
        //
        // }

        if(tmp.length > 0) {
            console.log(tmp);
            tmp = [];
        }


    });


};
start().then();

