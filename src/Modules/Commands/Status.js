const p = require('pidusage')
const d = require('discord.js')
const c = require('../../Config')
const u = require('../../Modules/Utils')

module.exports = {
    name: 'stats',
    desc: 'Display bot stats',
    async exec(message) {
        const info  = await p(process.pid)
        const embed = new d.MessageEmbed()
            .setColor(c.COLOR)
            .setTitle(c.FANCY_NAME || c.NAME)
            .setDescription('some so-called useful statistics about the bot')
            .setThumbnail(message.client.user.avatarURL())
            .addField(`\u200B`, `\u200B`, false)

            .addField(`Bot ver`, c.VERSION_BOT, true)
            .addField(`Data ver`, c.VERSION_DB, true)
            .addField(`\u200B`, `\u200B`, true)
            .addField(`Ping`, Math.round(message.client.ws.ping) + ' ms', true)
            .addField(`Uptime`, u.time_format(message.client.uptime / 1000), true)
            .addField(`Servers`, message.client.guilds.cache.size, true)

            .addField(`CPU`, info.cpu.toFixed(2) + ' %', true)
            .addField(`Memory`, (info.memory / 1000000).toFixed(2) + ' mb', true)
            .addField(`\u200B`, `\u200B`, true)

        return message.channel.send(embed)
    }
}
