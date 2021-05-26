const ch = require('chalk')
const cf = require('../../../Config')
const ut = require('../../../Modules/Utils')

module.exports = {
    name: 'ready',
    exec() {
        ut.log(ch.red(`${cf.NAME} (A:${cf.VERSION_BOT} - DB:${cf.VERSION_DB})`))

        for (let i = 0; i < cf.DISCORD_MAX_THREADS; i++) {
            require('../../Worker').spawn()
        }
    }
}
