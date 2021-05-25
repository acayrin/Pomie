const cf = require('../../../Config')
const ut = require('../../../Modules/Utils')
const db = require('../../Main').client.database
const { RateLimiter } = require('discord.js-rate-limiter')
const lm = new RateLimiter(1, cf.COOLDOWN * 1000)

module.exports = {
    name: 'message',
    exec(message) {
        if (message.author.bot
            || (message.content.split(' ').shift() !== `<@!${message.client.user.id}>`
            &&  message.content.split(' ').shift() !== cf.MAIN_PREFIX)) {
            return
        } else if (lm.take(message.author.id)) {
            message.channel.send(`Help only available once every ${cf.COOLDOWN} seconds`)
        } else {
            db.set('Queue', db.get('Queue').concat(ut.zip(JSON.stringify(message))))
        }
    }
}
