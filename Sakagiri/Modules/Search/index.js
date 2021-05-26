module.exports = {
    /**
     * search for items
     * @param {String} a search string
     * @returns {{ page: number, list: [] }} object contains page and item list
     */
    search: (a) => require('./Search').process(a),
    /**
     * print all items
     * @param {Object} a discord message
     * @param {[]} b array of items
     * @param {Number} c page
     */
    display_all: (a, b, c) => require('./Result/All').process(a, b, c),
    /**
     * print the item
     * @param {Object} a item object
     * @param {Object} b discord message
     * @param {Number} _c page
     */
    display_item: (a, b, _c) => require('./Result/Item').process(a, b, _c),
    /**
     * print the monster
     * @param {Object} a item object
     * @param {Object} b discord message
     */
    display_monster: (a, b) => require('./Result/Monster').process(a, b),
    /**
     * print the map
     * @param {Object} a item object
     * @param {Object} b discord message
     */
    display_map: (a, b) => require('./Result/Map').process(a, b),
    /**
     * filter items with matching name
     * @param {String} a name to filter
     * @param {[]} b array of items to filter
     * @returns {[]} filtered array
     */
    filterName: (a, b) => require('./Filters/Name').loopSearch(a, b),
    /**
     * filter items with prop comparison
     * @param {String[]} a array of prop comparators
     * @param {[]} b array of items to filter
     * @returns {[]} filtered array
     */
    filterProp: (a, b) => require('./Filters/Prop').loopFilter(a, b),
    /**
     * filter items with matching type
     * @param {String[]} a array of types
     * @param {[]} b array of items to filter
     * @returns {[]} filtered array
     */
    filterType : (a, b) => require('./Filters/Type').loopType(a, b)
}