
const getCommonArray = (a1, a2, start1, start2) => {

    let len = Infinity;
    let jMax = a2.length - 1;
    let resVal = null;
    let resI, resJ;

    // console.log(`"${String.fromCharCode(a1[start1])}", "${String.fromCharCode(a2[start2])}"`);

    for(let i = start1; i < a1.length; i++) {

        if(i - start1 >= len) {
            // console.log('break', i , len);
            break;
        }

        for(let j = start2; j <= jMax; j++) {

            // console.log(i, j);

            if(a1[i] === a2[j]) {
                // console.log('MATCH');
                let n = (i + j) - (start1 + start2);
                jMax = j - 1;
                if(n < len) {
                    len = n;
                    resVal = a1[i];
                    resI = i;
                    resJ = j;
                }
                // console.log('break j', n, a1[i]);
                break;
            }

        }

    }

    // console.log(start1, start2);
    // console.log(`Final. i = ${resI}, j = ${resJ}, value = ${String.fromCharCode(resVal)}, len = ${len}`);

    return {
        index1: resI,
        index2: resJ,
        len: len,
        value: resVal
    }

};

module.exports = {
    getCommonArray
};