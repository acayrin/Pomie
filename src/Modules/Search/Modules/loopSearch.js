const Utils = require('../../Utils')

module.exports.loopSearch = (name, list) => {
    for (const s of name.split(' ')) {
        list = Utils.filter(list, item => item.name.match(new RegExp(s, 'i')))
    }
    return list
}