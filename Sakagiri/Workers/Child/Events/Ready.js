const fs = require('fs')
const dc = require('discord.js-light')
const cf = require('../../../Config')
const ut = require('../../../Modules/Utils')
const { parentPort } = require('worker_threads')

module.exports = {
    name: 'ready',
    type: 0,
    async exec(client) {
        client.commands = new dc.Collection()
        client.database = new dc.Collection()

        // register commands
        for (const _f of fs.readdirSync(`${__dirname}/../../../Modules/Commands`)) {
            const _cmd = require('../../../Modules/Commands/' + _f)
            client.commands.set(_cmd.name, _cmd)
        }

        // add emotes for dyes support
        const emotes = []
        for (const g of await client.guilds.fetch(false)) {
            for (const e of await g[1].emojis.fetch(false)) {
                emotes.push(e[1])
            }
        }
        client.database.set('Emojis', emotes)
        client.database.set('Index', cf.ITEM_INDEX)

        // signal as ready
        parentPort.postMessage({ active: true })
        ut.log(`Worker is online`)
    }
}
