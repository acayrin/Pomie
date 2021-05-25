const c = require('../../Config')

module.exports = {
    name: 'tip',
    desc: 'Get a random Toram tip',
    hidden: (c.GAME_TIPS.length === 0),
    exec(message) {
        message.channel.send('**TIP:** ' + c.GAME_TIPS[Math.floor(Math.random() * c.GAME_TIPS.length)])
    }
}