const Utils = require('../../Utils')
const Eval  = require('eval')
/**
 * filter through stats filters
 * @param {Array<string>} filters list of filters
 * @param {Array} list data list
 */
module.exports.loopFilter = (filters, list) => {
    for (let i = filters.length; --i >= 0;) {
        const filter  = filters[i]
        // check for operators =>, >=, =<, <=, >, <, =
        const compare = filter.match(/((<|>)=)|<|>|=/g).shift()
        // check for comparison value
        const value   = filter.match(/\d+/g).pop()
        // check for attribute to compare
        const attr    = filter.replace(compare, '').replace(value, '').trim().toLowerCase()

        // filter
        list = Utils.filter(list, item => {
            // check if item has stats, proc/sell values
            if (!isNaN(item.sell) && attr.includes('sell')) {
                return Eval(`module.exports = () => { return ${item.sell} ${compare} ${value} }`)()

            } else if (/\d+/.test(item.proc) && attr.includes('proc')) {
                if (getType(attr) === getType(item.proc.toLowerCase()) || !getType(attr))
                    return Eval(`module.exports = () => { return ${item.proc.match(/\d+/)} ${compare} ${value} }`)()

            } else if (item.stats && item.stats.length > 0)
                for (let stat of item.stats) {
                    if (!/\d+/g.test(stat))
                        continue
                    const _val  = stat.match(/-?\d+/g).pop()                  // stat value
                    const _attr = stat.replace(_val, '').toLowerCase().trim() // stat attribute

                    if (_attr === attr)
                        return Eval(`module.exports = () => { return ${_val} ${compare} ${value} }`)()
                }
        })
    }

    return list
}

/**
 * get material type
 * @param {string} string
 * @returns type
*/
const getType = (string) => {
    for (let mat of ['beast', 'metal', 'cloth', 'mana', 'wood', 'medicine'])
        if (string.includes(mat))
            return mat
        else
            return undefined
}
