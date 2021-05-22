const chalk = require('chalk')
const config = require('../../../Config')
const utils = require('../../../Modules/Utils')

module.exports = {
    name: 'ready',
    exec() {
        utils.log(chalk.red(`${config.NAME} (A:${config.VERSION_BOT} - DB:${config.VERSION_DB})`))

        for (let i = 0; i < config.MAX_THREADS; i++) {
            require('../../Worker').spawn()
        }
    }
}
