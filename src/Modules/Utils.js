const chalk = require('chalk')
const {
    isMainThread,
    threadId
} = require('worker_threads')

// ===================================== Clean up duplicates in an Array =====================================
/**
@func uniq_fast
remove duplicates in an Array

@param {Array} a the array to unique
@return {Array} the unique'd array
*/
module.exports.uniq_fast = a => {
    const seen = {}
    const out = []
    let j = 0

    for (const item of a) {
        if (seen[item] !== 1) {
            seen[item] = 1
            out[j] = item
            j++
        }
    }

    return out
}
// ===================================== Clean up duplicates in an Array =====================================


// ===================================== Format seconds to HH:mm:ss =====================================
/**
@func time_format
format seconds to HH:mm:ss format

@param {Number} time seconds to convert
@return {String} formatted time
*/
module.exports.time_format = time => {
    time = Math.floor(time)
    const hrs = ~~(time / 3600)
    const mins = ~~(time % 3600 / 60)
    const secs = ~~time % 60
    let ret = ''

    if (hrs > 0) {
        ret += `${hrs}:${mins < 10 ? '0' : ''}`
    }

    ret += `${mins}:${secs < 10 ? '0' : ''}`
    ret += `${secs}`

    return ret
}
// ===================================== Format seconds to HH:mm:ss =====================================


// ===================================== Logger =====================================
/**
@func log
pretty log to console

@param {String} string string to log
@param {boolean} _isConsole show as CONSOLE instead of DISCORD
*/
module.exports.log = (string, _isConsole) => {
    const options = {
            timeZone: 'Asia/Bangkok',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        },
        formatter = new Intl.DateTimeFormat([], options)

    const x = _isConsole ? 'Console' : 'Discord'
    const t = formatter.format(new Date())
    const e = isMainThread ? 'Main' : `Mini #${threadId}`

    const a = chalk.magentaBright(`[${x} - ${t}]`)
    const b = chalk.yellowBright(`[${e}]`)
    console.log(`${a} ${b} ${string}`)
}
// ===================================== Logger =====================================


// ===================================== Json Diff =====================================
/**
@func jsonDiff
compare 2 json, return true if different, otherwise false

@param {Object} _a 1st json object
@param {Object} _b 2nd json object
@return {boolean} result
*/
module.exports.jsonDiff = (x, y) => {
    // if both are function
    if (x instanceof Function) {
        if (y instanceof Function) {
            return x.toString() === y.toString()
        }
        return false
    }
    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true
    }

    // if one of them is date, they must had equal valueOf
    if (x instanceof Date) {
        return false
    }
    if (y instanceof Date) {
        return false
    }

    // if they are not function or strictly equal, they both need to be Objects
    if (!(x instanceof Object)) {
        return false
    }
    if (!(y instanceof Object)) {
        return false
    }

    var p = Object.keys(x)
    return Object.keys(y).every(function (i) {
            return p.indexOf(i) !== -1
        }) ?
        p.every(function (i) {
            return this.jsonDiff(x[i], y[i])
        }) : false
}
// ===================================== Json Diff =====================================


// ===================================== Fast Filter =====================================
/**
@func filter
a custom high-performance filter

@perf
60% faster than the built-in JavaScript filter func

@typedef {(e: *) => boolean} filterFnAny
@param {*[]} a
@param {filterFnAny} fn
@return {*[]}
*/
module.exports.filter = (a, fn) => {
    const f = [] //final
    for (const b of a) {
        if (fn(b)) {
            f.push(b)
        }
    }
    return f
}
// ===================================== Fast Filter =====================================



// ===================================== Promise =====================================
/**
 * Resolve a promise with following function
 * @param {number} ms Timeout
 * @param {() => void} callback Function to execute
 * @returns
 */
module.exports.resolve = (callback, ms) =>
    new Promise((resolve) => setTimeout(() => resolve(callback), ms ? ms : 25))
// ===================================== Promise =====================================



// ===================================== JSON Compress =====================================
/**
 * Compress json into lzw String
 * @param {Object|Array} json input json
 * @returns {String} output string
 */
module.exports.zip = json => require('lz-string').compress(require('jsonpack').pack(json))
/**
 * Decompress lzw string into json
 * @param {String} lzw input string
 * @returns {Object} output json
 */
module.exports.unzip = lzw => require('jsonpack').unpack(require('lz-string').decompress(lzw))
// ===================================== JSON Compress =====================================
