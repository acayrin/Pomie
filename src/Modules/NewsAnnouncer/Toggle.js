const c = require('../../Config')

module.exports = {
    async exec(message) {
        const hook = (await message.channel.fetchWebhooks()).find(h => h.owner.id === message.client.user.id)

        if (hook) {
            hook.delete().then(() => {
                message.channel.send(`Channel **#${message.channel.name}** has been removed from the list`)
            })
        } else {
            message.channel.createWebhook(c.NAME, {
                avatar: message.client.user.avatarURL()
            }).then(() =>
                message.channel.send(`Added **#${message.channel.name}** to the list`)
            )
        }
    }
}
