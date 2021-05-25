const d = require('discord.js')
const c = require('../../Config')

module.exports = {
    name: 'help',
    desc: 'Display help page',
    exec(message) {
        const embed = new d.MessageEmbed()
        .setColor(c.COLOR)
        .setTitle('ＳＡＫＡＧＩＲＩ')
        .setDescription(`a Discord bot for Toram Online`)
        .setThumbnail(message.client.user.avatarURL())
        .addField(`\u200B`, `\u200B`)
        .addField(`Prefix`, `\`\` ${c.MAIN_PREFIX} \`\` - Main command prefix, check help below`)
        .addField(`Use`, `\`\` ${c.MAIN_PREFIX} <command> \`\``)
        .addField(`Commands`, `\u200B`)

        for (const _c of message.client.commands.keys()) {
            const e = message.client.commands.get(_c)
            if (e.name && !e.hidden) {
                const name = e.name + (e.short ? `|${e.short}` : '')
                embed.addField(`\`\`${name}\`\``, e.desc, true)
            }
        }

        embed
        .addField('\u200B', 'For detailed help, please check https://acayrin.github.io/sakagiri/commands/')
        .addField('Credits', '\u200B')
        .addField(`${c.NAME} (A:${c.VERSION_BOT} - DB:${c.VERSION_DB})`, 'by **acayrin**')
        .addField(`Data source`, `Coryn Club @ Cruithne https://coryn.club/`)

        return message.channel.send(embed)
    }
}
