const w = require('worker_threads')
const m = require('./Workers/Main.js')
const c = require('./Workers/Child.js')

/**
 * start the bot
 */
w.isMainThread
    ? m.start()
    : c.start()
