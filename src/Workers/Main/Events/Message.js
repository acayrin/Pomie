const db = require('../../Main').client.database
const config = require('../../../Config')
const utils = require('../../../Modules/Utils')
const {
    RateLimiter
} = require('discord.js-rate-limiter')
const limit = new RateLimiter(1, 5000)

module.exports = {
    name: 'message',
    exec(message) {
        if (message.author.bot || message.content.split(' ').shift().toLowerCase() !== config.MAIN_PREFIX)
            return

        if (limit.take(message.author.id))
            return message.channel.send('I can only help you once every 5 seconds, please be patient')

        db.set('Commands', db.get('Commands').concat(utils.zip(JSON.stringify(message))))
    }
}