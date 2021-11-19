
const diff = require('./diff');
const patch = require('./patch');
const utils = require('./utils');



const start = async () => {

    let startDate = Date.now();

    console.log(`Diff begin...`);

    let stat = await diff('./files/old.txt', './files/new.txt', './files/1.patch', false);

    let sec = (Date.now() - startDate) / 1000;

    console.log(`Diff done!`);
    console.log(`Time = ${sec.toFixed(3)} sec.`);
    console.log(`CRC32 = ${stat.crc32}`);
    console.log(`Changes Count = ${stat.changesCount}`);
    console.log(`Changes Size = ${stat.changesSize} bytes`);
    console.log(`Patch File Size = ${stat.patchFileSize} bytes`);
    console.log('');

    startDate = Date.now();
    console.log(`Patching begin...`);

    let stat2 = await patch('./files/old.txt', './files/1.patch', './files/result.txt', false);

    sec = (Date.now() - startDate) / 1000;
    console.log(`Patching done...`);
    console.log(`Time = ${sec.toFixed(3)} sec.`);
    console.log(`CRC32 = ${stat2.crc32}`);
    console.log(`Is correct? ${stat2.crc32 === stat.crc32 ? 'YES' : 'NO'}`);

};

const start2 = async () => {

    let a1 =    'My na1me is Sp4irit6'.split('');
    let a2 = 'First name 3is S*pi5rit'.split('');

    // console.log(a1, a2);

    let res = utils.findSequence(a1, a2, 0, 0, 4);

    console.log(res);



};

// start().then();
start2().then();


