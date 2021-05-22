const C = require('../Config')

module.exports = {
    exec(message) {
        const m = message.content.split(' ')
              m.shift() // remove 1st string (either prefix or tag)

        const c1 = m.join(' ')
        const c2 = c1.split(" ").shift().toLowerCase()
        const c3 = c1.slice(c2.length).trim()
        const c4 = message.client.commands.get(c2) || message.client.commands.find(_c => c2 && _c.short && _c.short.includes(c2))

        if (c4 && c4.role && !message.member.hasPermission(c4.role))
            return message.channel.send('Insufficient permissions')

        if (c4)
            c4.exec(message, c3)
        else if (c2)
            message.client.commands.get('search').exec(message, c1)
        else
            message.client.commands.get('help').exec(message, null)
    }
}
