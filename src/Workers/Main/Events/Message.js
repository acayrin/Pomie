const config = require('../../../Config')
const db = require('../../Main').client.database
const utils = require('../../../Modules/Utils')
const { RateLimiter } = require('discord.js-rate-limiter')
const limit = new RateLimiter(1, 5000)

module.exports = {
    name: 'message',
    exec(message) {
        if (message.author.bot
            || (message.content.split(' ').shift() !== `<@!${message.client.user.id}>`
            &&  message.content.split(' ').shift() !== config.MAIN_PREFIX)) {
            return
        } else if (limit.take(message.author.id)) {
            message.channel.send('Help only available once every 5 seconds')
        } else {
            db.set('Queue', db.get('Queue').concat(utils.zip(JSON.stringify(message))))
        }
    }
}
