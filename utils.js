
const compareSequence = (a1, a2, i, j) => {

    let maxSeqLen = 10;

    for(let n = 1; n < maxSeqLen; n++) {

        if(i + n > a1.length - 1 || j + n > a2.length - 1) {
            // maxSeqLen = n;
            // break;
            continue;
        }

        if(a1[i + n] !== a2[j + n]) {
            maxSeqLen = n;
            break;
        }

    }

    // console.log('res =', maxSeqLen);
    return maxSeqLen;

};

const getCommonArray = (a1, a2, start1, start2) => {

    let weight = 0;
    let jMax = a2.length - 1;
    let resVal = null;
    let resI, resJ;

    // console.log(`"${String.fromCharCode(a1[start1])}", "${String.fromCharCode(a2[start2])}"`);

    for(let i = start1; i < a1.length; i++) {

        if(i - start1 >= weight) {
            // console.log('break', i , weight);
            // break;
        }

        for(let j = start2; j <= jMax; j++) {

            // console.log(i, j);

            if(a1[i] === a2[j]) {
                // console.log('MATCH');

                let w = 1 / ((i + j) - (start1 + start2) + 1) * compareSequence(a1, a2, i, j); // calc weight
                // console.log('ww', w);
                // jMax = j - 1;
                if(w > weight) {
                    weight = w;
                    resVal = a1[i];
                    resI = i;
                    resJ = j;
                }
                // console.log('break j', w, a1[i]);
                break;
            }

        }

    }

    // console.log(start1, start2);
    console.log(`Final. i = ${resI}, j = ${resJ}, value = ${String.fromCharCode(resVal)}, weight = ${weight}`);

    return {
        index1: resI,
        index2: resJ,
        len: weight,
        value: resVal
    }

};

module.exports = {
    getCommonArray
};