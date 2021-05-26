const nw = require('../../../Modules/NewsAnnouncer/Fetch')

module.exports = {
    name: 'fetch_news',
    /**
     * start fetching news from en.toram.jp
     * @param {Object} client discord client
     */
    exec(client) {
        setInterval(() => nw.exec(client), 1 * 1000)
    }
}
