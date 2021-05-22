const Utils = require('../../../Modules/Utils')
const client = require('../../Main').client

module.exports = {
    name: ['SIGTERM', 'SIGINT'],
    process: true,
    exec() {
        Utils.log(`Shutting down. Goodbye...`)
        client.destroy()
        process.exit()
    }
}
