
const findSequence = (a1, a2, start1, start2, seqLen = 8) => {

    for(let i = start1; i < a1.length; i++) {


        for(let j = start2; j <= a2.length; j++) {

            if(a1[i] === a2[j]) {

                let isEqual = true;
                for(let n = 1; n <= seqLen; n++) {
                    if(a1[i + n] !== a2[j + n]) {
                        isEqual = false;
                        break;
                    }
                }

                if(isEqual) {
                    // console.log(`>> i = ${i}, j = ${j}, value = ${String.fromCharCode(a1[i])}`);
                    console.log(`>> i = ${i}, j = ${j}, value = ${a1[i]}`);

                    return {
                        isFinal: false,
                        index1: i,
                        index2: j,
                    }
                }

            }

        }

    }

    // это значит что просмотрели весь массив но общих последовательностей так и не было найдено
    return {
        isFinal: true,
        index1: a1.length,
        index2: a2.length,
    }

};

module.exports = {
    findSequence
};