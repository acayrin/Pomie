const u = require('../../../Modules/Utils')
const c = require('../../../Modules/CommandHandler')

module.exports = {
    name: 'message',
    type: 1,
    exec(client, msg) {
        try {
            msg = u.unzip(msg)
            client.channels.fetch(msg.channelID).then(channel => {
                channel.messages.fetch(msg.id).then(m => {
                    c.exec(m)
                })
            })
        } catch (e) {
            u.log(e, 3)
        }
    }
}
