const config = require('./Config')
const fetch = require('node-fetch')
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
const Utils = require('./lib/Utils')
const {
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads')
const SysStat = require('node-sysstat')
const sysstat = new SysStat({
    interval: 3
})


// only workers allowed
if (isMainThread)
    return

// ===================================== Variables =====================================
const Index = [] // cached database
const lastUsed = new Map() // store last time this worker was used
const Promises = [] // command promises
// ===================================== Variables =====================================



// ===================================== Functions =====================================
// exports
const _bot = () => client
module.exports = {
    _bot,
    Index
}
// ===================================== Functions =====================================



// ===================================== Worker =====================================
// Discord
client.login(config.DISCORD_BOT_TOKEN) // - Discord.JS
client.on('ready', async () => {
    // ===================================== Preload =====================================
    // load database
    Index.push(...JSON.parse(await (await fetch('https://kohri-api.vercel.app/database?search=*')).text()))

    // set dummy last used
    lastUsed.set('lastUsed', Date.now())

    Utils.log(`Mini is online`)
    // ===================================== Preload =====================================



    // ===================================== Statistics =====================================
    sysstat.on('stats', (stats) => {
        parentPort.postMessage(Utils.zip({
            active: true,
            stats: stats,
            lastactive: lastUsed.get('lastUsed'),
            promises: Promises,
            hitWarning: (stats['mem.heapUsed'] / (200 * 1024 * 1024) * 100 >= 80) ? true : false,
            lastUsed: ((Date.now() - lastUsed.get('lastUsed')) / 1000 >= workerData.timeout) ? true : false,
            timeout: ((Date.now() - lastUsed.get('lastUsed')) / 1000)
        }))
    })
    // ===================================== Statistics =====================================



    // ===================================== Message Listener =====================================
    parentPort.on('message', get => {
        // parse the data
        get = Utils.unzip(get)

        // fetch the channel => message then process it
        client.channels.fetch(get.channelID).then(channel => {
            channel.messages.fetch(get.id).then(message => {
                // set last used to now
                lastUsed.set('lastUsed', Date.now())

                // add to running tasks list
                Promises.push(message.content)
                
                // resolve the command
                Utils.resolve(require('./lib/CommandHandler').execute(message), 0).finally(() => {
                    Promises.splice(Promises.indexOf(get.id), 1)
                })
            })
        })
    })
    // ===================================== Message Listener =====================================
})
// ===================================== Worker =====================================