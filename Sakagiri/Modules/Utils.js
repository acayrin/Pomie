module.exports = {
    /**
     * Unique an Array
     * @param {Array} a input array
     * @returns unique'd array
     */
    uniq_fast: a => {
        const seen = {}
        const out = []
        let j = 0
        for (const i of a) {
            if (seen[i] !== 1) {
                seen[i] = 1
                out[j] = i
                j++
            }
        }
        return out
    },
    /**
     * format seconds to HH:mm:ss
     * @param {Number} time input seconds
     * @returns {String} formatted time
     */
    time_format: time => {
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
    },
    /**
     * Fast filter an array
     * @param {Array} a input array
     * @param {() => void} cb function used to compare values
     * @returns filtered array
     */
    filter: (a, cb) => {
        const f = []
        for (const b of a) {
            if (cb(b)) {
                f.push(b)
            }
        }
        return f
    },
    /**
     * compress object into lzw string
     * @param {Object|Array} json input json
     * @returns {String} output string
     */
    zip: obj => require('lz-string').compress(JSON.stringify(obj)),
    /**
     * decompress lzw string into object
     * @param {String} lzw input string
     * @returns {Object} output object
     */
    unzip: lzw => JSON.parse(require('lz-string').decompress(lzw)),
    /**
     * Log a string
     * @param {String} msg input message
     * @param {Number} _level log level (1-3 : INFO-ERROR)
     * @param {String} _tag additional tag
     */
    log: (msg, _level, _tag) => {
        msg = msg.toString()
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

        let c = undefined
        try {
            c = require('chalk')
        } catch (e) {
            // chalk not found
        }

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
        msg += r ? '\r' : '\n'
        process.stdout.write(`${msg}`)
    },
    /**
     * convert rgb color to hex value
     * @param {String} rgb rgb color
     * @returns {String} hex color
     */
    rgb2hex: (rgb) => rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join(''),
    /**
     * execute function as promise
     * @param {number} ms timeout
     * @param {() => void} cb function to execute
     * @returns
     */
    resolve: (cb, ms) => new Promise((resolve) => setTimeout(() => resolve(cb), ms ? ms : 25)),
    /**
     * compare 2 objects, return true if different, otherwise false
     * @param {Object} _a 1st object
     * @param {Object} _b 2nd object
     * @return {boolean} result
     */
    diff: (_a, _b) => {
        if (_a instanceof Function) {
            if (_b instanceof Function) {
                return _a.toString() === _b.toString()
            }
            return true
        } else if (!_a || !_b) {
            return _a !== _b
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
}
