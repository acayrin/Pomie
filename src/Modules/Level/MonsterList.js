const Utils = require('../Utils')
const config = require('../../Config')
const { inPlaceSort } = require('fast-sort')
const Search = require('../../Modules/Commands/Search')

module.exports.getMobList = async (_level, _bonus) => {
    // variables
    const _map = new Map()
    const level = Number(_level)
    const get = await Search.exec(null, '* -t boss;mini;monster')

    // loop
    main:
        for (let i = get.length; --i >= 0;) {
            // variable
            const key = get[i]

            // ignore event mobs
            for (const ignore of config.IGNORE_LEVELING_NAME) {
                if (key.name.toLowerCase().includes(ignore.toLowerCase())) {
                    continue main
                }
            }
            for (const ignore of config.IGNORE_LEVELING_ID) {
                if (key.id.toLowerCase().includes(ignore.toLowerCase())) {
                    continue main
                }
            }
            for (const ignore of config.IGNORE_LEVELING_MAP) {
                if (key.map.toLowerCase().includes(ignore.toLowerCase())) {
                    continue main
                }
            }
            if (key['exp'] === -1) {
                continue main
            }

            const lvl = Number(key['level']) ? Number(key['level']) : 1
            const _be = Number(key['exp']) ? Number(key['exp']) : 1
            const _bm = _bonus ? (1 + (Number(_bonus) / 100)) : 0
            let _dm = 1

            if (Math.abs(lvl - level) < 10) {
                if (Math.abs(lvl - level) <= 5) {
                    _dm = 11
                } else if (Math.abs(lvl - level) <= 6) {
                    _dm = 10
                } else if (Math.abs(lvl - level) <= 7) {
                    _dm = 9
                } else if (Math.abs(lvl - level) <= 8) {
                    _dm = 7
                } else if (Math.abs(lvl - level) <= 9) {
                    _dm = 3
                }

                _map.set(key, Math.floor((_be * _dm) * (1 + _bm)))
            }
        }
    return Utils.uniq_fast(inPlaceSort(Array.from(_map)).desc(_a => _a[1]))
}
// ===================================== Get list of level with bonus =====================================
