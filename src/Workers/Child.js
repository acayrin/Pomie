const c = require('../Config')
const Discord = require('discord.js-light')
const client = new Discord.Client({
    // limit message cache size
    messageCacheMaxSize: 50,
    // limit message ttl
    messageCacheLifetime: 10,
    // clean up every 5 min
    messageSweepInterval: 10,
    // edit history
    messageEditHistoryMaxSize: 10,
    // only cache guilds and emotes
    cacheGuilds: true,
    cacheChannels: false,
    cacheOverwrites: true,
    cacheRoles: false,
    cacheEmojis: true,
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
    ]
})
const {
    parentPort
} = require('worker_threads')
const fs = require('fs')

module.exports = {
    _bot() {
        return client
    }
}

for (let e of fs.readdirSync(__dirname + '/Child/Events')) {
    const ev = require(__dirname + '/Child/Events/' + e)

    ev.type === 0 ?
        client.on(ev.name, () => ev.exec(client))
    : ev.type === 1 ?
        parentPort.on(ev.name, g => ev.exec(client, g))
    : ev.exec()
}

client.login(c.DISCORD_BOT_TOKEN)