const timer = Date.now()
const fs = require('fs')
const u = require('../../../Modules/Utils')
const Discord = require('discord.js-light')
const {
    parentPort
} = require('worker_threads')

module.exports = {
    name: 'ready',
    type: 0,
    async exec(client) {
        client.commands = new Discord.Collection()
        client.database = new Discord.Collection()

        for (const _f of fs.readdirSync(`${__dirname}/../../../Modules/Commands`)) {
            const _cmd = require('../../../Modules/Commands/' + _f)
            client.commands.set(_cmd.name, _cmd)
        }

        const emotes = []
        for (const g of await client.guilds.fetch(false)) {
            for (const e of await g[1].emojis.fetch(false)) {
                emotes.push(e[1])
            }
        }
        client.database.set('Emojis', emotes)
        client.database.set('Index', JSON.parse(fs.readFileSync(`${__dirname}/../../../Sakagiri.json`, 'utf-8')).index)
        client.database.set('lastUsed', Date.now())
        client.database.set('active', true)

        parentPort.postMessage({ active: true })
        u.log(`Mini is online - took ${((Date.now() - timer) / 1000).toFixed(2)}s`)
    }
}
