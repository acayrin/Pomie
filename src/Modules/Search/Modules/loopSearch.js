const Utils = require('../../Utils')

module.exports.loopSearch = (string, list) => {
    for (let i = string.split(' ').length; --i >= 0;)
        list = Utils.filter(list, item => item.name.toLowerCase().includes(string.split(' ')[i].toLowerCase()))
    return list
}