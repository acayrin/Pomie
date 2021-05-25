const nw = require('../../../Modules/NewsAnnouncer/Fetch')

module.exports = {
    name: 'fetch_news',
    exec(client) {
        setInterval(() => nw.exec(client), 1 * 1000)
    }
}
