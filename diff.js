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
};

const start = async () => {

    let buf1 = await loadFile('./files/file.bin');
    // let buf2 = await loadFile('./files/insert.bin');
    let buf2 = await loadFile('./files/change.bin');


    let target = blocksFromBuffer(buf1);
    let dest = blocksFromBuffer(buf2);

    // console.log(blocks1);
    // console.log(blocks2);

    let j = 0;
    let isSearch = false;
    let targetStartIndex = 0;
    let destStartIndex = 0;
    for(let i = 0; i < target.length; i++) {


        if(!isSearch && target[i] !== dest[j]) {

            isSearch = true;
            targetStartIndex = i;
            destStartIndex = j;

            // пройтись от j+1 до последнего блока dest в поисках совпадения с block[i]
            // если дойдя до конца не нашлось, то искать так же от j+1 но уже block[i+1]

            // console.log(`Change block ${i}`);
        }

        if(isSearch) {

            for(let n = destStartIndex + 1; n < dest.length; n++) {

                if(target[i] === dest[n]) {
                    isSearch = false;
                    console.log(`Target start=${targetStartIndex} end=${i}. Dest start=${destStartIndex} end=${n}`);
                    j = n;
                    break;
                }

            }

        }

        j++;

    }


};
start().then();

