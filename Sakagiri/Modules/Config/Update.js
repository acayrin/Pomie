const fs = require('fs')
const pt = require('path')
const ut = require('../Utils')
const nf = require('node-fetch')

/**
 * Restart the app on data change
 * @param {Number} ver version to compare
 * @param {Number} _int interval, in seconds (default 30)
 * @returns () => void
 */
module.exports.run = (ver, _int) => setInterval(async () => {
    let diff = false
    try {
        const t = await nf(process.env.DISCORD_DATA_URL)
        if (t) {
            const j = JSON.parse(await t.text())
            if (j.version !== ver) {
                diff = true
            }
        }
    } catch (e) {
        try {
            const j = JSON.parse(fs.readFileSync(pt.resolve(process.env.DISCORD_DATA_URL), 'utf-8'))
            if (j.version !== ver) {
                db = j
                diff = true
            }
        } catch (f) {
            // skip
        }
    }
    if (diff) {
        // restart the process
        ut.log(`Data changed, restarting...`)
        process.on("exit", function () {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            })
        })
        process.exit()
    }
}, (_int || 30) * 1000)