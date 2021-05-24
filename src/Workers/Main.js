const fs = require('fs')
const config = require('../Config')
const Discord = require('discord.js-light')
const client = new Discord.Client({
    messageCacheMaxSize: 300,
    messageCacheLifetime: 3,
    messageSweepInterval: 3,
    messageEditHistoryMaxSize: 0,
    cacheGuilds: true,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
    cachePresences: false,
    disabledEvents: [
        'messageUpdate',
        'messageDelete',
        'messageDeleteBulk',
        'messageReactionAdd',
        'messageReactionRemove',
        'messageReactionRemoveAll',
        'messageReactionRemoveEmoji',
        'channelPinsUpdate',
        'roleCreate',
        'roleUpdate',
        'roleDelete',
        'inviteCreate',
        'inviteDelete',
        'emojiCreate',
        'emojiUpdate',
        'emojiDelete',
        'guildEmojisUpdate',
        'guildBanAdd',
        'guildBanRemove',
        'guildIntegrationsUpdate',
        'presenceUpdate',
        'typingStart',
        'voiceStateUpdate',
        'webhookUpdate'
    ],
    presence: {
        activity: {
            name: `with my friend '${config.MAIN_PREFIX} help'`,
            type: 'PLAYING'
        }
    }
})

module.exports = {
    client,
    start() {
        client.database = new Discord.Collection()
        client.database.set('Workers', [])
        client.database.set('Queue', [])

        for (const e of fs.readdirSync(`${__dirname}/Main/Events/`)) {
            const ev = require(`${__dirname}/Main/Events/${e}`)

            if (Array.isArray(ev.name)) {
                for (const n of ev.name) {
                    ev.process ?
                        process.on(n, (v) => ev.exec(v)) :
                        client.on(n, a => ev.exec(a))
                }
            } else {
                ev.process ?
                    process.on(ev.name, (v) => ev.exec(v)) :
                    client.on(ev.name, a => ev.exec(a))
            }
        }

        for (const e of fs.readdirSync(__dirname + '/Main/Tasks')) {
            require(`${__dirname}/Main/Tasks/${e}`).exec(client)
        }

        client.login(config.DISCORD_BOT_TOKEN)
    }
}
