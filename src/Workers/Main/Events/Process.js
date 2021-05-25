const ut = require('../../../Modules/Utils')
const cl = require('../../Main').client

module.exports = {
    name: ['SIGTERM', 'SIGINT'],
    process: true,
    exec() {
        ut.log(`Shutting down. Goodbye...`)
        cl.destroy()
        process.exit()
    }
}
