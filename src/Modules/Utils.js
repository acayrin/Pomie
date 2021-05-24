// ===================================== Clean up duplicates in an Array =====================================
/**
 * Unique an Array
 * 
 * @param {Array} a input array
 * @returns unique'd array
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
 * Format seconds to HH:mm:ss format
 *
 * @param {Number} time seconds to convert
 * @return {String} formatted time
 */
module.exports.time_format = time => {
    time = Math.floor(time)
    const hrs = ~~(time / 3600)
    const mins = ~~(time % 3600 / 60)
    const secs = ~~time % 60
    let ret = ""

    if (hrs > 0) {
        ret += `${hrs}:${mins < 10 ? '0' : ''}`
    }

    ret += `${mins}:${secs < 10 ? '0' : ''}`
    ret += `${secs}`

    return ret
}
// ===================================== Format seconds to HH:mm:ss =====================================



// ===================================== Json Diff =====================================
/**
 * Compare 2 json, return true if different, otherwise false
 *
 * @param {Object} _a 1st json object
 * @param {Object} _b 2nd json object
 * @return {boolean} result
 */
module.exports.jsDiff = (_a, _b) => {
    if (_a instanceof Function) {
        if (_b instanceof Function) {
            return _a.toString() === _b.toString()
        }
        return true
    } else if (!_a || !_b) {
        return _a === _b
    } else if (_a === _b || _a.valueOf() === _b.valueOf()) {
        return false
    } else if (Array.isArray(_a)) {
        if (Array.isArray(_b)) {
            if (_a.sort().length !== _b.sort().length) {
                return true
            }
            for (const _aa of _a) {
                if (_b.indexOf(_aa) === -1) {
                    const test = this.jsDiff(_b[_a.indexOf(_aa)], _aa)
                    if (test) {
                        return true
                    }
                }
            }
            return false
        }
        return true
    } else if (Object.keys(_a).length !== Object.keys(_b).length) {
        return true
    } else {
        for (const _k in _a) {
            const test = this.jsDiff(_a[_k], _b[_k])
            if (test) {
                return true
            }
        }
    }
    return false
}
// ===================================== Json Diff =====================================


// ===================================== Fast Filter =====================================
/**
 * Fast filter array
 * 
 * @param {Array} a input array
 * @param {() => void} cb callback function
 * @returns filtered array
 */
module.exports.filter = (a, cb) => {
    const f = []
    for (const b of a) {
        if (cb(b)) {
            f.push(b)
        }
    }
    return f
}
// ===================================== Fast Filter =====================================



// ===================================== JSON Compress =====================================
/**
 * Compress object into lzw string
 * 
 * @param {Object|Array} json input json
 * @returns {String} output string
 */
module.exports.zip = obj => require('lz-string').compress(require('jsonpack').pack(obj))
/**
 * Decompress lzw string into object
 * 
 * @param {String} lzw input string
 * @returns {Object} output object
 */
module.exports.unzip = lzw => require('jsonpack').unpack(require('lz-string').decompress(lzw))
// ===================================== JSON Compress =====================================



// ===================================== fillWith =====================================
/**
 * Fill a string with replacement
 * 
 * @param {String} replace replacement string
 * @param {Number} amount amount to fill up
 * @param {Boolean} _backward fill backwards instead
 * @returns filled string
 */
String.prototype.fillWith = function (replace, amount, _backward) {
    let _s = ''
    for (let s = Math.abs(amount - this.valueOf().length); --s >= 0;) {
        _s += replace
    }
    return (_backward ? _s + this.valueOf() : this.valueOf() + _s)
}
// ===================================== fillWith =====================================



// ===================================== Logger =====================================
/**
 * Log a string
 * 
 * @param {String} msg input message
 * @param {Number} _level log level (1-3 : INFO-ERROR)
 * @param {String} _tag additional tag
 */
module.exports.log = (msg, _level, _tag) => {
    let c = undefined
    try {
        c = require('chalk')
    } catch (e) {
        // chalk not found
    }
    if (msg instanceof Error) {
        return console.log(c ? c.red(msg) : msg)
    }
    const options = {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }
    const formatter = new Intl.DateTimeFormat([], options)
    const u = formatter.format(new Date())
    const r = msg.endsWith('\r')
    const t = require('worker_threads')
    const w = t.isMainThread ? 'Main' : `Worker #${t.threadId}`
    const l = _level || 1

    _tag && (msg = `${_tag} ${msg}`)
    switch (l) {
        case 1:
            msg = (c ? c.gray(`[${u} - ${w} - INFO]`) : `[${u} - ${w} - INFO]`) + ` ${msg}`
            break
        case 2:
            msg = (c ? c.yellow(`[${u} - ${w} - WARN]`) : `[${u} - ${w} - WARN]`) + ` ${msg}`
            break
        case 3:
            msg = (c ? c.red(`[${u} - ${w} - ERROR]`) : `[${u} - ${w} - ERROR]`) + ` ${msg}`
            break
        default:
            msg = (c ? c.gray(`[${u} - ${w} - INFO]`) : `[${u} - ${w} - INFO]`) + ` ${msg}`
    }

    r && (msg = msg.slice(0, -1))
    msg = msg.fillWith(' ', process.stdout.columns)
    msg += r ? '\r' : '\n'

    process.stdout.write(`${msg}`)
}
// ===================================== Logger =====================================



// ===================================== RGB2Hex =====================================
/**
 * Convert RGB color to Hex
 *
 * @param {String} rgb rgb color
 * @returns {String} hex color
 */
module.exports.rgb2hex = (rgb) => rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')
// ===================================== RGB2Hex =====================================



// ===================================== Promise =====================================
/**
 * Execute function as promise
 * 
 * @param {number} ms Timeout
 * @param {() => void} callback Function to execute
 * @returns
 */
module.exports.resolve = (callback, ms) =>
    new Promise((resolve) => setTimeout(() => resolve(callback), ms ? ms : 25))
// ===================================== Promise =====================================
