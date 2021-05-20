const config = require('../Config')
const Discord = require('discord.js-light')
const client = new Discord.Client({
    // limit message cache size
    messageCacheMaxSize: 300,
    // limit message ttl
    messageCacheLifetime: 10,
    // clean up every 5 min
    messageSweepInterval: 10,
    // edit history
    messageEditHistoryMaxSize: 10,
    // only cache guilds and emotes
    cacheGuilds: true,
    // cacheChannels: false
    cacheOverwrites: false,
    cacheRoles: true,
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
const fs = require('fs')

module.exports = {
    client,
    start() {
        client.database = new Discord.Collection()
        client.database.set('Workers', [])
        client.database.set('Commands', [])

        for (let e of fs.readdirSync(__dirname + '/Main/Events')) {
            const ev = require(__dirname + '/Main/Events/' + e)

            if (Array.isArray(ev.name))
                for (let n of ev.name)
                    ev.process ? 
                        process.on(n, () => ev.exec(client)) :
                        client.on(n, a => ev.exec(a))
            else
                ev.process ? 
                    process.on(ev.name, () => ev.exec(client)):
                    client.on(ev.name, a => ev.exec(a))
        }

        for (let e of fs.readdirSync(__dirname + '/Main/Tasks'))
            require(__dirname + '/Main/Tasks/' + e).exec(client)

        client.login(config.DISCORD_BOT_TOKEN)
    }
}