const cf = require('../Config')
const db = require('./Main').client.database
const ut = require('../Modules/Utils')
const { Worker } = require('worker_threads')

module.exports = {
    spawn() {
        if (db.get('Workers').length > cf.MAX_THREADS) {
            return null
        }

        const child = new Worker(`${__dirname}/Child.js`, {
            maxOldGenerationSizeMb: cf.HEROKU ? 1024 / cf.MAX_THREADS : 512
        })

        ut.log(`+ Spawned Mini #${child.threadId}`)

        child.on('error', err => {
            ut.log(`- Worker #${child.threadId} died (Error: ${err.message})`, 3)
            ut.log(err, 3)
            db.set('Workers', ut.filter(db.get('Workers'), wkr => wkr !== child))
            this.spawn()
        })

        child.on('message', (e) => {
            if (db.get('Workers').indexOf(child) === -1 && e.active) {
                db.set('Workers', db.get('Workers').concat(child))
            }
        })

        return child
    }
}
