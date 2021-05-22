const SysStat = require('node-sysstat')
const sysstat = new SysStat({
    interval: 3
})
const {
    parentPort,
    workerData
} = require('worker_threads')

module.exports = {
    name: 'stats',
    type: 2,
    exec() {
        sysstat.on('stats', (stats) => {
            const db = require('../../Child')._bot().database

            if (db && db.get('active')) {
                parentPort.postMessage({
                    stats: stats,
                    hitWarning: (stats['mem.heapUsed'] / (200 * 1024 * 1024) * 100 >= 80) ? true : false,
                    lastUsed: ((Date.now() - db.get('lastUsed')) / 1000 >= workerData.timeout) ? true : false,
                    timeout: ((Date.now() - db.get('lastUsed')) / 1000)
                })
            }
        })
    }
}