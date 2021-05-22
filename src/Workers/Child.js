const c = require('../Config')
const Discord = require('discord.js-light')
const client = new Discord.Client({
    messageCacheMaxSize: 50,
    messageCacheLifetime: 3,
    messageSweepInterval: 3,
    messageEditHistoryMaxSize: 0,
    cacheGuilds: true,
    cacheChannels: false,
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

    if (ev.type === 0)
        client.on(ev.name, () => ev.exec(client))
    else if (ev.type === 1)
        parentPort.on(ev.name, g => ev.exec(client, g))
    else ev.exec()
}

client.login(c.DISCORD_BOT_TOKEN)