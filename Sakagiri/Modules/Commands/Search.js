const sc = require('../Search')

module.exports = {
    name: 'search',
    desc: 'Search for an in-game item',
    async exec(message, search) {
        const { page, list } = sc.search(search)

        if (list.err) {
            return message.channel.send(list.err)
        } else if (list.length === 0) {
            //return message.channel.send('Nothing but dust')
        } else if (list.length > 1) {
            sc.display_all(message, list, page)
        } else {
            const item = list.shift()
            if (item.id.includes('T')) {
                sc.display_item(item, message, page)
            }
            if (item.id.includes('E')) {
                sc.display_monster(item, message)
            }
            if (item.id.includes('M')) {
                sc.display_map(item, message)
            }
        }
    }
}
