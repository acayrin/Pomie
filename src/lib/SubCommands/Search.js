const fsort = require('fast-sort')
const Utils = require('../Utils')
const Kohri = require('../../Worker.Child.js')


/**
 * @function search search for an item
 * @param message dicordjs message, if any
 * @param search search phrase
 * @return a message or a list
 */
module.exports.search = async (message, search) => {
    // variables
    const regexID = /^(?:[a-z][0-9]+)[a-z0-9]*$/ig      // regex for matching ID
    const _aa   = search.match(/(?:[^\s"]+|"[^"]*")/g) // regex for matching -text and "text"
    let type    = undefined         // item type
    let page    = 1                 // result page
    let filters = []                // a list of stats filter
    // load database
    let list    = Kohri.Index
    
    // loop through arguments
    if (Array.isArray(_aa))
        for (let i = _aa.length; --i >= 0;) {
            // results page
            if (_aa.indexOf("--page") !== -1) {
                page    = Number(_aa[_aa.indexOf('--page') + 1])
                _aa.splice(_aa.indexOf('--page'), 2)
                search  = _aa.join(' ')
            }
            if (_aa.indexOf("-p") !== -1) {
                page    = Number(_aa[_aa.indexOf('-p') + 1])
                _aa.splice(_aa.indexOf('-p'), 2)
                search  = _aa.join(' ')
            }
            // filter item type
            if (_aa.indexOf("--type") !== -1) {
                type    = _aa[_aa.indexOf('--type') + 1].replace(/"/g, "")
                _aa.splice(_aa.indexOf('--type'), 2)
                search  = _aa.join(' ')
            }
            if (_aa.indexOf("-t") !== -1) {
                type    = _aa[_aa.indexOf('-t') + 1].replace(/"/g, "")
                _aa.splice(_aa.indexOf('-t'), 2)
                search  = _aa.join(' ')
            }
            // filter item stats
            if (_aa.indexOf("--filter") !== -1) {
                filters = _aa[_aa.indexOf('--filter') + 1].replace(/"/g, "").split(";")
                _aa.splice(_aa.indexOf('--filter'), 2)
                search  = _aa.join(' ')
            }
            if (_aa.indexOf("-f") !== -1) {
                filters = _aa[_aa.indexOf('-f') + 1].replace(/"/g, "").split(";")
                _aa.splice(_aa.indexOf('-f'), 2)
                search  = _aa.join(' ')
            }
        }
        
    // if is an ID
    if (regexID.test(search)) {
        let found = false
        for (let i = list.length; --i >= 0;)
            if (list[i].id.toLowerCase() === search.match(regexID).shift().toLowerCase()) {
                list  = [list[i]]
                found = true
                break
            }
        if (!found)
            list = []
    }
    // if search for all items
    else if (search === '*' || search === 'all')
        list // keep
    // filter each search words
    else
        list = await Utils.resolve(require('../Search/Modules/loopSearch').loopSearch(search, list), 25)
    // type filtering
    if (type)
        list = await Utils.resolve(require('../Search/Modules/loopType').loopType(type, list), 25)
    // stats filtering
    if (filters.length > 0)
        list = await Utils.resolve(require('../Search/Modules/loopFilter').loopFilter(filters, list), 25)
    // for external uses
    if (!message)
        return list

    // if nothing was found
    if (list.length === 0)
        return message.channel.send('Nothing was found in the book')

    // print out list
    let res  = []
    if (list.length > 1) {
        // ascending sort
        list = fsort.inPlaceSort(list).by([{ asc: i => i.id.length }, { desc: e => e.id.match(/\d+/g).shift() }])

        // if page not found
        if ((page - 1) * 20 > list.length)
            return message.channel.send(`Hmmm.., I don't remember reading this page before`)

        res.push(`> Results **${(page - 1) * 20 + 1}** to **${page * 20 > list.length ? list.length : page * 20}** of **${list.length}** (page **${page}** of **${Math.ceil(list.length / 20) === 0 ? 1 : Math.ceil(list.length / 20)}**)`)
        res.push('>  ')
        if (type)
            res.push(`> Filter type **${type}**`)
        if (filters.length > 0)
            res.push(`> Filter stat **${filters.join(', ')}**`)
        if (type || filters.length > 0)
            res.push(`>  `)

        // map each type and store array of items with the type
        let each = new Map()

        // store the items to their type
        for (let i = page * 20; --i >= (page - 1) * 20;) {
            const item  = list[i] // item json
            if (item) {
                if (!each.get(item.type))   // if not set yet
                    each.set(item.type, []) // set the new map with empty array
                const array = each.get(item.type)
                array.push(item)
                each.set(item.type, array) // add item to the array
            }
        }

        // print
        for (let type of each.keys()) {
            res.push(`> ~~                ~~ **${type}** ~~                ~~`)
            for (let item of each.get(type))
                res.push(`> [${item.id}] > **${item.name}**`)
        }

        // send the results
        return message.channel.send(res.join('\n'))
    }

    // send 1 only
    let item = list.shift()
    // if its an item
    if (item.id.includes('T')) require('../Search/Item.Search').process(item, message, page)
    // if its a mob
    if (item.id.includes('E')) require('../Search/Mob.Search').process(item, message)
    // if its a map
    if (item.id.includes('M')) require('../Search/Map.Search').process(item, message)
}
