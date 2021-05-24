const u = require('../../../Modules/Utils')
const ch = require('../../../Modules/CommandHandler')

module.exports = {
    name: 'message',
    type: 1,
    exec(client, msg) {
        try {
            msg = u.unzip(msg)

            client.channels.fetch(msg.channelID).then(channel => {
                channel.messages.fetch(msg.id).then(m => {
                    client.database.set('lastUsed', Date.now())
                    u.resolve(ch.exec(m))
                })
            })
        } catch (e) {
            console.log(e)
        }
    }
}
