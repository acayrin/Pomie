const ut = require('../Utils')
const sc = require('../Search')
const cf = require('../../Config')
const { inPlaceSort } = require('fast-sort')

/**
 * fetch a list of mobs based on experience gain for a level
 * @param {Number} _level level to get
 * @param {Number} _bonus exp bonus
 * @returns {[]} list of mobs
 */
module.exports.getMobList = (_level, _bonus) => {
    // variables
    const map = new Map()
    const _l1 = Number(_level)
    const get = sc.search('* -t boss;mini;monster').list

    // loop
    main:
        for (let i = get.length; --i >= 0;) {
            // variable
            const key = get[i]

            // ignore event mobs
            for (const ignore of cf.IGNORE_LEVELING_NAME) {
                if (key.name.toLowerCase().includes(ignore.toLowerCase())) {
                    continue main
                }
            }
            for (const ignore of cf.IGNORE_LEVELING_ID) {
                if (key.id.toLowerCase().includes(ignore.toLowerCase())) {
                    continue main
                }
            }
            for (const ignore of cf.IGNORE_LEVELING_MAP) {
                if (key.map.toLowerCase().includes(ignore.toLowerCase())) {
                    continue main
                }
            }
            if (key['exp'] === -1) {
                continue main
            }

            const _l2 = Number(key['level']) ? Number(key['level']) : 1
            const _be = Number(key['exp']) ? Number(key['exp']) : 1
            const _bm = _bonus ? (1 + (Number(_bonus) / 100)) : 0
            let   _dm = 1

            if (Math.abs(_l2 - _l1) < 10) {
                if (Math.abs(_l2 - _l1) <= 5) {
                    _dm = 11
                } else if (Math.abs(_l2 - _l1) <= 6) {
                    _dm = 10
                } else if (Math.abs(_l2 - _l1) <= 7) {
                    _dm = 9
                } else if (Math.abs(_l2 - _l1) <= 8) {
                    _dm = 7
                } else if (Math.abs(_l2 - _l1) <= 9) {
                    _dm = 3
                }

                map.set(key, Math.floor((_be * _dm) * (1 + _bm)))
            }
        }
    return ut.uniq_fast(inPlaceSort(Array.from(map)).desc(_a => _a[1]))
}
