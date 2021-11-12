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
    for(let i = 0; i < buf.length; i++) {
        blocks.push(buf.readUInt8(i));
    }
    return blocks;
};

const start = async () => {

    let buf1 = await loadFile('./files/file.txt');
    let buf2 = await loadFile('./files/remove.txt');
    // let buf2 = await loadFile('./files/changed.txt');


    let newFile = blocksFromBuffer(buf1);
    let oldFile = blocksFromBuffer(buf2);

    // console.log(newFile);
    // console.log(oldFile);


    let j = 0;
    let isSearch = false;
    let newStartIndex = 0;
    let oldStartIndex = 0;
    for(let i = 0; i < newFile.length; i++) {

        if(!isSearch && newFile[i] !== oldFile[j]) {

            isSearch = true;
            newStartIndex = i;
            oldStartIndex = j;

            // пройтись от j+1 до последнего блока oldFile в поисках совпадения с block[i]
            // если дойдя до конца не нашлось, то искать так же от j+1 но уже block[i+1]

            // console.log(`Change block ${i}`);
        }

        if(isSearch) {

            // запускаем цикл для проверку удаления

            for (let m = newStartIndex + 1; m < newFile.length; m++) {

                if (newFile[m] === oldFile[oldStartIndex]) {
                    i = m;
                    isSearch = false;
                    console.log(`Remove start=${newStartIndex} end=${m} `);
                    break;
                }

            }

        }

        // if(isSearch) {
        //
        //     // is update / insert
        //
        //     for(let n = oldStartIndex + 1; n < oldFile.length; n++) {
        //
        //         if(newFile[i] === oldFile[n]) {
        //             isSearch = false;
        //             console.log(`Target start=${newStartIndex} end=${i}. Dest start=${oldStartIndex} end=${n}`);
        //             j = n;
        //             break;
        //         }
        //
        //     }
        //
        // }

        j++;

    }

    if(oldFile.length > j) {
        // второй файл еще не кончился, значит добавляем остаток к концу
        console.log(`Target start=${newFile.length} end=${newFile.length}. Dest start=${j} end=${oldFile.length}`);
    }

};
start().then();

