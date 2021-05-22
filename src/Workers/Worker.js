const DB = require('./Main').client.database
const Utils = require('../Modules/Utils')
const chalk = require('chalk')
const {
    Worker
} = require('worker_threads')

module.exports = {
    spawn() {
        if (DB.get('Workers').length > 5) {
            return null
        }

        const child = new Worker(`${__dirname}/Child.js`, {
            workerData: {
                timeout: 900
            },
            maxOldGenerationSizeMb: 200
        })
        Utils.log(chalk.green(`+ Spawned Mini #${child.threadId}`))

        child.on('error', err => {
            Utils.log(chalk.red(`- Mini #${child.threadId} died (Error: ${err.message})`))
            console.log(err)

            DB.set('Workers', Utils.filter(DB.get('Workers'), wkr => wkr !== child))

            this.spawn()
        })

        child.on('message', (e) => {
            if (DB.get('Workers').indexOf(child) === -1 && e.active) {
                DB.set('Workers', DB.get('Workers').concat(child))
            }

            if (e.hitWarning) {
                Utils.log(chalk.yellow(`Mini #${child.threadId} reached 80% heap, spawning new one`))
                this.spawn()
            }

            if (e.lastUsed) {
                if (DB.get('Workers').length === 1) {
                    return
                }

                const ID = child.threadId
                Utils.log(chalk.yellow(`Mini #${child.threadId} hasn't been used in ${e.timeout} seconds, terminating it`))

                DB.set('Workers', Utils.filter(DB.get('Workers'), wkr => wkr !== child))

                child.terminate().then(() => {
                    Utils.log(chalk.red(`- Mini #${ID} has been terminated`))
                })
            }
        })

        return child
    }
}
