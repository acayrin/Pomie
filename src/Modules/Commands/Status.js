const pid = require('pidusage')
const Discord = require('discord.js')
const config = require('../../Config')
const utils = require('../../Modules/Utils')

module.exports = {
    name: 'stats',
    desc: 'Display bot stats',
    async exec(message) {
        const info  = await pid(process.pid)
        const embed = new Discord.MessageEmbed()
            .setColor(config.COLOR)
            .setTitle('ＳＡＫＡＧＩＲＩ')
            .setDescription('some so-called useful statistics about the bot')
            .setThumbnail(message.client.user.avatarURL())
            .addField(`\u200B`, `\u200B`, false)

            .addField(`Bot ver`, config.VERSION_BOT, true)
            .addField(`Data ver`, config.VERSION_DB, true)
            .addField(`\u200B`, `\u200B`, true)
            .addField(`Ping`, Math.round(message.client.ws.ping) + ' ms', true)
            .addField(`Uptime`, utils.time_format(message.client.uptime / 1000), true)
            .addField(`Servers`, message.client.guilds.cache.size, true)

            .addField(`CPU`, info.cpu.toFixed(2) + ' %', true)
            .addField(`Memory`, (info.memory / 1000000).toFixed(2) + ' mb', true)
            .addField(`\u200B`, `\u200B`, true)

        return message.channel.send(embed)
    }
}
