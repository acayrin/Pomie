const sc = require('./index')
const r1 = /(?:[^\s"]+|"[^"]*")/g
const r2 = /^(?:[a-z][0-9]+)[a-z0-9]*$/ig
const cl = require('../../Workers/Child').client

module.exports = {
    process: (search) => {
        let list = cl.database.get('Index')
        let type = undefined
        let page = 1
        let filters = []

        const _aa = search.match(r1)
        if (_aa) {
            for (const _a of _aa) {
                const _v = _aa[_aa.indexOf(_a) + 1]
                switch (_a) {
                    case '-p':
                    case '--page':
                        if (!_v) {
                            return { err: `Missing argument after **${_a}**` }
                        }
                        if (isNaN(_v)) {
                            return { err: `Invalid page number **${_v}**` }
                        }
                        page = Number(_v)
                        search = search.replace(_a, '').replace(_v, '').trim()
                        break
                    case '-t':
                    case '--type':
                        if (!_v) {
                            return { err: `Missing argument after **${_a}**` }
                        }
                        type = _v.replace(/"/g, '')
                        search = search.replace(_a, '').replace(_v, '').trim()
                        break
                    case '-f':
                    case '--filter':
                        if (!_v) {
                            return { err: `Missing argument after **${_a}**` }
                        }
                        filters = _v.replace(/"/g, '').split(";")
                        search = search.replace(_a, '').replace(_v, '').trim()
                        break
                    default:
                        // empty
                }
            }
        }

        if (r2.test(search)) {
            let f = false
            let i = list.length
            while (--i > 0) {
                if (list[i].id.toLowerCase() === search.match(r2).shift().toLowerCase()) {
                    list = [list[i]]
                    f = true
                    break
                }
            }
            if (!f) {
                list = []
            }
        } else if (search !== '*' && search !== 'all') {
            list = sc.filterName(search, list)
        }
        if (type) {
            list = sc.filterType(type, list)
        }
        if (filters.length > 0) {
            list = sc.filterProp(filters, list)
        }
        return { page: page, list: list }
    }
}