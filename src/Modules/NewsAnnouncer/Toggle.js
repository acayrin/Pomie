const config = require('../../Config')

module.exports = {
    async exec(message) {
        const hook = (await message.channel.fetchWebhooks()).find(h => h.name === config.NAME)

        if (hook)
            // delete hook
            hook.delete().then(() => {
                message.channel.send(`Channel **#${message.channel.name}** has been removed from the list`)
            })
        else
            // add hook
            message.channel.createWebhook(config.NAME, {
                avatar: message.client.user.avatarURL()
            }).then(() =>
                message.channel.send(`Added **#${message.channel.name}** to the list`)
            )
    }
}