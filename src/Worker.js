const Bot = require('./Worker.Main')
const Utils = require('./lib/Utils')
const chalk = require('chalk')
const {
    Worker
} = require('worker_threads')

/**
 * Spawn in new Worker Thread
 * @returns A new Worker Thread
 */
module.exports.spawn = () => {
    // cancel if more than 10 workers
    if (Bot.Workers.length > 5)
        return null

    // ===================================== Worker =====================================
    const child = new Worker(`${__dirname}/Worker.Child.js`, {
        workerData: {
            timeout: 900 // timeout in seconds
        },
        maxOldGenerationSizeMb: 200
    })
    Utils.log(`${chalk.redBright('[Manager]')} + Spawned Mini #${child.threadId}`)
    // ===================================== Worker =====================================



    // ===================================== Error =====================================
    child.on('error', err => {
        // log error
        Utils.log(`${chalk.redBright('[Manager]')} - Mini #${child.threadId} died (Error: ${err.message})`)
        console.log(err)

        // remove the old worker from list
        Bot.Workers.splice(Bot.Workers.indexOf(child), 1)
        Bot.Workload.delete(child.threadId)
        // spawn in a worker
        this.spawn()
    })
    // ===================================== Error =====================================



    // ===================================== Message =====================================
    child.on('message', (e) => {
        e = Utils.unzip(e)

        if (Bot.Workers.indexOf(child) === -1 && e.active)
            Bot.Workers.push(child)

        Bot.Workload.set(child.threadId, Utils.zip({
            cpu: (e.stats['cpu.usage.thread'] / 2).toFixed(2),
            mem: (e.stats['mem.heapUsed'] / (100 * 1024 * 1024) * 100).toFixed(2),
            last: Utils.time_format((Date.now() - e.lastactive) / 1000),
            promises: e.promises
        }))

        // if worker hit heap usage warning
        if (e.hitWarning) {
            Utils.log(`${chalk.redBright('[Manager]')} Mini #${child.threadId} reached 80% heap, spawning new one`)
            this.spawn()
        }

        // if worker is inactive
        if (e.lastUsed) {
            if (Bot.Workers.length === 1) // cancel if only 1 worker left
                return
            const ID = child.threadId
            Utils.log(`${chalk.redBright('[Manager]')} Mini #${child.threadId} hasn't been used in ${e.timeout} seconds, terminating it`)
            // remove from list
            Bot.Workers.splice(Bot.Workers.indexOf(child), 1)
            Bot.Workload.delete(child.threadId)
            // terminate the worker
            child.terminate().then(() => {
                Utils.log(`${chalk.redBright('[Manager]')} Mini #${ID} has been terminated`)
            })
        }
    })
    // ===================================== Message =====================================

    return child
}