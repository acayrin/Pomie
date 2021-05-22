const a = require('./NewsAnnouncer/Task')

module.exports = {
    start() {
        return a.exec()
    }
}
