const a = require('../NewsAnnouncer/Toggle')

module.exports = {
    name: 'subscribe',
    desc: 'Toggle current channel to recieve Toram news',
    role: ['ADMINISTRATOR'],
    short: 'sub',
    exec(message) {
        return a.exec(message)
    }
}
