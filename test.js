
const diff = require('./diff');
const patch = require('./patch');



const start = async () => {

    let startDate = Date.now();

    console.log(`Diff begin...`);

    let stat = await diff('./files/hello.exe', './files/hello_mod.exe', './files/1.patch', false);

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

    let stat2 = await patch('./files/hello.exe', './files/1.patch', './files/hello_RES.exe', false);

    sec = (Date.now() - startDate) / 1000;
    console.log(`Patching done...`);
    console.log(`Time = ${sec.toFixed(3)} sec.`);
    console.log(`CRC32 = ${stat2.crc32}`);
    console.log(`Is correct? ${stat2.crc32 === stat.crc32 ? 'YES' : 'NO'}`);

};

start().then();


