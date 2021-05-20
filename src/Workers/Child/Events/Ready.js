const timer = Date.now() 
const fs = require('fs')
const nf = require('node-fetch')
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

        for (let _f of fs.readdirSync(__dirname + '/../../../Modules/Commands')) {
            const _cmd = require('../../../Modules/Commands/' + _f)
            client.commands.set(_cmd.name, _cmd)
        }

        client.database.set('Index', JSON.parse(await (await nf('https://kohri-api.vercel.app/database?search=*')).text()))
        client.database.set('lastUsed', Date.now())

        parentPort.postMessage({ active: true })
        client.database.set('active', true)
        u.log(`Mini is online - took ${((Date.now() - timer) / 1000).toFixed(2)}s`)
    }
}