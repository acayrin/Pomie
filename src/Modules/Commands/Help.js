const Discord = require('discord.js')
const config = require('../../Config')

module.exports = {
    name: 'help',
    desc: 'Display help page',
    exec(message) {
        const embed = new Discord.MessageEmbed()
        .setColor(config.COLOR)
        .setTitle('ＳＡＫＡＧＩＲＩ')
        .setDescription(`a Discord bot for Toram Online`)
        .setThumbnail(message.client.user.avatarURL())
        .addField(`\u200B`, `\u200B`)
        .addField(`Prefix`, `\`\` ${config.MAIN_PREFIX} \`\` - Main command prefix, check help below`)
        .addField(`Use`, `\`\` ${config.MAIN_PREFIX} <command> \`\``)
        .addField(`Commands`, `\u200B`)

        for (const _c of message.client.commands.keys()) {
            const c = message.client.commands.get(_c)
            if (c.name && !c.hidden) {
                c.name += c.short ? `|${c.short}` : ''
                embed.addField(`\`\`${c.name}\`\``, c.desc, true)
            }
        }

        embed
        .addField('\u200B', 'For detailed help, please check https://acayrin.github.io/sakagiri/commands/')
        .addField('Credits', '\u200B')
        .addField(`${config.NAME} (A:${config.VERSION_BOT} - DB:${config.VERSION_DB})`, 'by **acayrin**')
        .addField(`Data source`, `Coryn Club @ Cruithne https://coryn.club/`)

        return message.channel.send(embed)
    }
}
