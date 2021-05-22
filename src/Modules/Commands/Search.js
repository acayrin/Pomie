const client = require('../../Workers/Child')._bot()
const fsort = require('fast-sort')
const Utils = require('../Utils')
const regexID = /^(?:[a-z][0-9]+)[a-z0-9]*$/ig
const regexAR = /(?:[^\s"]+|"[^"]*")/g

module.exports = {
    name: 'search',
    desc: 'Search for an in-game item',
    async exec(message, search) {
        let list = client.database.get('Index')
        let type = undefined
        let page = 1
        let filters = []

        const _aa = search.match(regexAR)
        for (const _a of _aa) {
            const _v = _aa[_aa.indexOf(_a) + 1]
            switch (_a) {
                case '-p':
                case '--page':
                    page = Number(_v)
                    search = search.replace(_a, '').replace(_v, '').trim()
                    break
                case '-t':
                case '--type':
                    type = _v.replace(/"/g, '')
                    search = search.replace(_a, '').replace(_v, '').trim()
                    break
                case '-f':
                case '--filter':
                    filters = _v.replace(/"/g, '').split(";")
                    search = search.replace(_a, '').replace(_v, '').trim()
                    break
                default:
                    // empty
            }
        }

        if (regexID.test(search)) {
            let f = false
            let i = list.length
            while (i > 0) {
                i--

                if (list[i].id.toLowerCase() === search.match(regexID).shift().toLowerCase()) {
                    list = [list[i]]
                    f = true
                    break
                }
            }
            if (!f) {
                list = []
            }
        } else if (search !== '*' && search !== 'all') {
            list = await Utils.resolve(require('../Search/Modules/loopSearch').loopSearch(search, list))
        }
        if (type) {
            list = await Utils.resolve(require('../Search/Modules/loopType').loopType(type, list))
        }
        if (filters.length > 0) {
            list = await Utils.resolve(require('../Search/Modules/loopFilter').loopFilter(filters, list))
        }

        if (!message) {
            return list
        }
        if (list.length === 0) {
            return message.channel.send('Nothing but dust')
        }

        const res = []
        if (list.length > 1) {
            list = fsort.inPlaceSort(list).by([{
                asc: i => i.id.length
            }, {
                desc: e => e.id.match(/\d+/g).shift()
            }])

            if ((page - 1) * 20 > list.length) {
                return message.channel.send(`Page does not exist`)
            }

            const _curView = page * 20 > list.length ? list.length : page * 20
            const _curPage = (page - 1) * 20 + 1
            const _maxPage = Math.ceil(list.length / 20) === 0 ? 1 : Math.ceil(list.length / 20)

            res.push(`> Results **${_curPage}** to **${_curView}** of **${list.length}** (page **${page}** of **${_maxPage}**)`)
            res.push('>  ')

            if (type) {
                res.push(`> Filter type **${type}**`)
            }
            if (filters.length > 0) {
                res.push(`> Filter stat **${filters.join(', ')}**`)
            }
            if (type || filters.length > 0) {
                res.push(`>  `)
            }

            const each = new Map()
            for (let i = (page - 1) * 20; i < page * 20; i++) {
                const _i = list[i]
                if (!_i) {
                    continue
                }
                if (!each.get(_i.type)) {
                    each.set(_i.type, [])
                }

                each.set(_i.type, each.get(_i.type).concat(_i))
            }

            for (const t of each.keys()) {
                res.push(`> ~~                ~~ **${t}** ~~                ~~`)
                for (const i of each.get(t)) {
                    res.push(`> [${i.id}] > **${i.name}**`)
                }
            }

            return message.channel.send(res.join('\n'))
        }

        const item = list.shift()
        if (item.id.includes('T')) {
            return require('../Search/Item.Search').process(item, message, page)
        }
        if (item.id.includes('E')) {
            return require('../Search/Mob.Search').process(item, message)
        }
        if (item.id.includes('M')) {
            return require('../Search/Map.Search').process(item, message)
        }
    }
}
