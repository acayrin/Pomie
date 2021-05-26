const pt = require('path')
const cf = require('../Config')
const ut = require('../Modules/Utils')
const db = require('./Main').client.database
const { Worker } = require('worker_threads')

module.exports = {
    /**
     * spawn in a worker
     * @returns {Worker} worker instance
     */
    spawn() {
        // spawn in with child script
        const child = new Worker(pt.resolve('./Sakagiri/index.js'), {
            maxOldGenerationSizeMb: cf.HEROKU ? 1024 / cf.DISCORD_MAX_THREADS : 512
        })

        // log
        ut.log(`+ Spawned Mini #${child.threadId}`)

        // on error, spawn a new one
        child.on('error', err => {
            ut.log(`- Worker #${child.threadId} died (Error: ${err.message})`, 3)
            ut.log(err, 3)
            db.set('Workers', ut.filter(db.get('Workers'), wkr => wkr !== child))
            this.spawn()
        })

        // on message
        child.on('message', (e) => {
            if (db.get('Workers').indexOf(child) === -1 && e.active) {
                db.set('Workers', db.get('Workers').concat(child))
            }
        })

        // return the worker
        return child
    }
}
