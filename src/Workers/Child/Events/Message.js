const u = require('../../../Modules/Utils')
const ch = require('../../../Modules/CommandHandler')

module.exports = {
    name: 'message',
    type: 1,
    exec(client, msg) {
        msg = u.unzip(msg)

        client.channels.fetch(msg.channelID).then(channel => {
            channel.messages.fetch(msg.id).then(m => {
                client.database.set('lastUsed', Date.now())
                
                u.resolve(ch.exec(m), 0)
            })
        })
    }
}