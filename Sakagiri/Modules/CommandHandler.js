module.exports = {
    /**
     * find and run command based on message
     * @param {Object} message discord message
     */
    exec(message) {
        const m = message.content.split(' ')
              m.shift()

        const c1 = m.join(' ')
        const c2 = c1.split(" ").shift().toLowerCase()
        const c3 = c1.slice(c2.length).trim()
        const c4 = message.client.commands.get(c2) || message.client.commands.find(_c => c2 && _c.short && _c.short.includes(c2))

        if (c4) {
            if (c4.role && !message.member.hasPermission(c4.role)) {
                message.channel.send('Insufficient permissions')
            } else if (!c4.disabled) {
                c4.exec(message, c3)
            }
        } else if (c2) {
            message.client.commands.get('search').exec(message, c1)
        } else {
            message.client.commands.get('help').exec(message, null)
        }
    }
}
