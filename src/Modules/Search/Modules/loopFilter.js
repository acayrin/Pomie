const Utils = require('../../Utils')
const Eval  = require('eval')

module.exports.loopFilter = (filters, list) => {
    for (const filter of filters) {
        const compare = filter.match(/((<|>)=)|<|>|=/g).shift()
        const value   = filter.match(/\d+/g).pop()
        const attr    = filter.replace(compare, '').replace(value, '').trim().toLowerCase()

        list = Utils.filter(list, item => {
            if (!isNaN(item.sell) && attr.includes('sell')) {
                return Eval(`module.exports = () => { return ${item.sell} ${compare} ${value} }`)()

            } else if (/\d+/.test(item.proc) && attr.includes('proc')) {
                if (getType(attr) === getType(item.proc.toLowerCase()) || !getType(attr)) {
                    return Eval(`module.exports = () => { return ${item.proc.match(/\d+/)} ${compare} ${value} }`)()
                }

            } else if (item.stats && item.stats.length > 0) {
                for (const stat of item.stats) {
                    if (!/\d+/g.test(stat)) {
                        continue
                    }
                    const _val  = stat.match(/-?\d+/g).pop()
                    const _attr = stat.replace(_val, '').toLowerCase().trim()

                    if (_attr === attr) {
                        return Eval(`module.exports = () => { return ${_val} ${compare} ${value} }`)()
                    }
                }
            }
        })
    }

    return list
}

const getType = (string) => {
    let m = undefined
    for (const mat of ['beast', 'metal', 'cloth', 'mana', 'wood', 'medicine']) {
        if (string.includes(mat)) {
            m = mat
        }
    }
    return m
}
