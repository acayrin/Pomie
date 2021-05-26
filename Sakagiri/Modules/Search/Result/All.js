const fs = require('fast-sort')

module.exports = {
    process: (message, list, page) => {
        list = fs.inPlaceSort(list).by([{
            asc: i => i.id.length
        }, {
            desc: e => e.id.match(/\d+/g).shift()
        }])

        if ((page - 1) * 20 > list.length) {
            return message.channel.send(`Page does not exist`)
        }

        const res = []
        const _curView = page * 20 > list.length ? list.length : page * 20
        const _curPage = (page - 1) * 20 + 1
        const _maxPage = Math.ceil(list.length / 20) === 0 ? 1 : Math.ceil(list.length / 20)

        res.push(`> Results **${_curPage}** to **${_curView}** of **${list.length}** (page **${page}** of **${_maxPage}**)`)
        res.push('>  ')

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

        message.channel.send(res.join('\n'))
    }
}