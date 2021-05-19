const config = require('./Config')
const chalk = require('chalk')
const fetch = require('node-fetch')
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
    ]
})
const Utils = require('./lib/Utils')
const {
    RateLimiter
} = require('discord.js-rate-limiter')
const limit = new RateLimiter(1, 5000)


// ===================================== Variables =====================================
const Workers = [] // workers
const Workload = new Map() // Load for each worker
const Commands = [] // list of commands
// ===================================== Variables =====================================



// ===================================== Functions =====================================
// exports
const _bot = () => client
module.exports = {
    client,
    _bot,
    Workers,
    Workload
}
// ===================================== Functions =====================================



// ===================================== Preload =====================================
/**
 * Start the Bot with X max amount of Threads (default 5)
 * @param {Number} _amount
 */
module.exports.start = (_amount) => {
    // login
    client.login(config.DISCORD_BOT_TOKEN)

    // ===================================== Preload =====================================
    client.on('ready', async () => {
        Utils.log(`Starting ${config.NAME}...`)

        // spawn workers
        for (let i = _amount; --i >= 0;)
            require('./Worker').spawn()

        // ready
        client.user.setActivity(`with my friend, "${config.MAIN_PREFIX} help"`, {
            type: 'PLAYING'
        })
        Utils.log(chalk.red(`${config.NAME} (A:${config.VERSION_BOT} - DB:${config.VERSION_DB})`))

        // tasks
        require('./lib/NewsAnnouncer').start()

        // health check
        client.setInterval(() => fetch('https://sakagiri.herokuapp.com/'), 300 * 1000)
    })
    // ===================================== Preload =====================================



    // ===================================== Process =====================================
    client.on('message', message => {
        // reject bot and normal messages
        if (message.author.bot || message.content.split(' ').shift().toLowerCase() !== config.MAIN_PREFIX)
            return

        // limit any command usage to 5 secs
        if (limit.take(message.author.id))
            return message.channel.send('I can only help you once every 5 seconds, please be patient')

        // push to list
        Commands.push(Utils.zip(JSON.stringify(message)))
    })

    // execute 100 cmds per sec
    client.setInterval(() => {
        const worker = Workers[Math.floor(Math.random() * Workers.length)]

        if (worker && Commands.length > 0)
            worker.postMessage(Commands.shift())
    }, 10)
    // ===================================== Process =====================================



    // ===================================== SIGNALS handler =====================================
    // shutdown
    process.on('SIGTERM', () => {
        Utils.log(`Shutting down. Goodbye...`)
        client.destroy()
        process.exit()
    })
    process.on('SIGINT', () => {
        Utils.log(`Shutting down. Goodbye...`)
        client.destroy()
        process.exit()
    })
    // ===================================== SIGNALS handler =====================================
}
// ===================================== Preload =====================================