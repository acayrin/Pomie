const Utils = require('../../../Modules/Utils')

module.exports = {
    name: ['SIGTERM', 'SIGINT'],
    process: true,
    exec(client) {
        Utils.log(`Shutting down. Goodbye...`)
        client.destroy()
        process.exit()
    }
}