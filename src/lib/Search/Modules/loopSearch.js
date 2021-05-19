const Utils = require('../../Utils')
/**
 * filter data list based on search string
 * @param {String} string search string
 * @param {Array} list data list
 */
module.exports.loopSearch = (string, list) => {
    for (let i = string.split(' ').length; --i >= 0;)
        list = Utils.filter(list, item => item.name.toLowerCase().includes(string.split(' ')[i].toLowerCase()))
    return list
}