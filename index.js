const LineByLineReader = require('line-by-line'),
    promise = require("promise");

let inputFile = './testfile.jsonl'

iterate_jsonl_file = () => {
    return new promise(function (resolve, reject) {
        try {
            const Lr = new LineByLineReader(inputFile);
            let idx = 0

            Lr.on('error', function (err) {
                // 'err' contains error object
                reject(`line reader error: ${err}`)
                reject()
            });

            Lr.on('line', function (line) {
                // 'line' contains the current line without the trailing newline character.
                Lr.pause()
                idx += 1

                isJSON(line)
                    .then(() => {
                        return (checkBasicPatchRequirements(line))
                    })
                    .then(() => {
                        Lr.resume()
                    })
                    .catch((err) => {
                        console.log(`${idx} failed: ${err}`)
                        Lr.resume()
                    })
            });

            Lr.on('end', function () {
                // All lines are read, file is closed now.
                resolve()
            });
        } catch (err) {
            reject(`iterate JSONL file error: ${err}`)
        }
    })
}

isJSON = (candidate) => {
    return new promise(function (resolve, reject) {
        try {
            candidate = JSON.parse(candidate)
            resolve()
        } catch (error) {
            reject(`line is not valid JSON`)
        }
    })
}

checkBasicPatchRequirements = (candidate) => {
    return new promise(function (resolve, reject) {
        candidate = JSON.parse(candidate)
        let canidateTopLevelKeys = Object.keys(candidate)

        findIndexOf('op', canidateTopLevelKeys)
            .then(() => findIndexOf('path', canidateTopLevelKeys))
            .then(() => resolve())
            .catch((err) => {
                reject(err)
            })
    })
}

findIndexOf = (test, keyArray) => {
    return new promise(function (resolve, reject) {
        findIndexOfIterator(test, keyArray, 0, () => {
            resolve()
        }, (err) => {
            reject(err)
        })
    })
}

findIndexOfIterator = (test, keyArray, idx, cb, errCb) => {
    try {
        if (keyArray[idx]) {
            if (keyArray[idx] == test) {
                cb()
            } else {
                findIndexOfIterator(test, keyArray, idx + 1, cb, errCb)
            }
        } else {
            errCb(`${test} not found`)
        }
    } catch (error) {
        errCb(`find index of key error: ${error}`)
    }
}

iterate_jsonl_file()
    .then(() => {
        console.log('All done. If you see no errors above, your JSONL has passed basic tests.')
    })
    .catch((err) => {
        console.log(`error parsing file: ${err}`)
    })