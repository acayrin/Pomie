const fsort = require('fast-sort')
const Utils = require('../Utils')

module.exports = {
    name: 'search',
    desc: 'Search for an in-game item',
    async exec(message, search) {
        const regexID = /^(?:[a-z][0-9]+)[a-z0-9]*$/ig
        const _aa = search.match(/(?:[^\s"]+|"[^"]*")/g)
        let type = undefined
        let page = 1
        let filters = []
        let list = message.client.database.get('Index')

        if (Array.isArray(_aa))
            for (let i = _aa.length; --i >= 0;) {
                // results page
                if (_aa.indexOf("--page") !== -1) {
                    page = Number(_aa[_aa.indexOf('--page') + 1])
                    _aa.splice(_aa.indexOf('--page'), 2)
                    search = _aa.join(' ')
                }
                if (_aa.indexOf("-p") !== -1) {
                    page = Number(_aa[_aa.indexOf('-p') + 1])
                    _aa.splice(_aa.indexOf('-p'), 2)
                    search = _aa.join(' ')
                }
                // filter item type
                if (_aa.indexOf("--type") !== -1) {
                    type = _aa[_aa.indexOf('--type') + 1].replace(/"/g, "")
                    _aa.splice(_aa.indexOf('--type'), 2)
                    search = _aa.join(' ')
                }
                if (_aa.indexOf("-t") !== -1) {
                    type = _aa[_aa.indexOf('-t') + 1].replace(/"/g, "")
                    _aa.splice(_aa.indexOf('-t'), 2)
                    search = _aa.join(' ')
                }
                // filter item stats
                if (_aa.indexOf("--filter") !== -1) {
                    filters = _aa[_aa.indexOf('--filter') + 1].replace(/"/g, "").split(";")
                    _aa.splice(_aa.indexOf('--filter'), 2)
                    search = _aa.join(' ')
                }
                if (_aa.indexOf("-f") !== -1) {
                    filters = _aa[_aa.indexOf('-f') + 1].replace(/"/g, "").split(";")
                    _aa.splice(_aa.indexOf('-f'), 2)
                    search = _aa.join(' ')
                }
            }

        if (regexID.test(search)) {
            let i = list.length
            let f = false
            while(--i) {
                if (list[i].id.toLowerCase() === search.match(regexID).shift().toLowerCase()) {
                    list = [list[i]]
                    f = true
                    break
                }
            }
            if (!f)
                list = []
        }
        else if (search !== '*' && search !== 'all')
            list = await Utils.resolve(require('../Search/Modules/loopSearch').loopSearch(search, list))
        if (type)
            list = await Utils.resolve(require('../Search/Modules/loopType').loopType(type, list))
        if (filters.length > 0)
            list = await Utils.resolve(require('../Search/Modules/loopFilter').loopFilter(filters, list))

        if (!message)
            return list
        if (list.length === 0)
            return message.channel.send('Nothing was found in the book')

        let res = []
        if (list.length > 1) {
            list = fsort.inPlaceSort(list).by([{
                asc: i => i.id.length
            }, {
                desc: e => e.id.match(/\d+/g).shift()
            }])

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

            let each = new Map()
            for (let i = page * 20; --i >= (page - 1) * 20;) {
                const item = list[i]
                if (!item)
                    continue
                if (!each.get(item.type))
                    each.set(item.type, [])
                const array = each.get(item.type)
                array.push(item)
                each.set(item.type, array)
            }

            for (let type of each.keys()) {
                res.push(`> ~~                ~~ **${type}** ~~                ~~`)
                for (let item of each.get(type))
                    res.push(`> [${item.id}] > **${item.name}**`)
            }

            return message.channel.send(res.join('\n'))
        }

        let item = list.shift()
        if (item.id.includes('T')) return require('../Search/Item.Search').process(item, message, page)
        if (item.id.includes('E')) return require('../Search/Mob.Search').process(item, message)
        if (item.id.includes('M')) return require('../Search/Map.Search').process(item, message)
    }
}