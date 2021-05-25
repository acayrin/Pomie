const nw = require('../../../Modules/NewsAnnouncer/Fetch')

module.exports = {
    name: 'fetch_news',
    exec(client) {
        setInterval(async () => await nw.exec(client), 1 * 1000)
    }
}
