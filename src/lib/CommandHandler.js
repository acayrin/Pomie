const Discord = require('discord.js')
const Bot = require('../Worker.Child')
const config = require('../Config')
const cmds = ['search', 'level', 'lvl', 'help', 'subscribe']

function execute(message) {
    const check = message.content.replace(config.MAIN_PREFIX, '').trim()
    const cmd = check.split(" ").shift().toLowerCase()
    const args = check.slice(cmd.length).trim()

    // ===================================== Main Help =====================================
    if (!cmd || cmd === 'help')
        return message.channel.send(new Discord.MessageEmbed()
                .setColor(config.COLOR)
                .setTitle('ＳＡＫＡＧＩＲＩ')
                .setThumbnail(Bot._bot().user.avatarURL())
                .setDescription(`a discord bot for most of your toram needs`)
                .addField(`\u200B`, `\u200B`)
                .addField(`Prefix`, `\`\` ${config.MAIN_PREFIX} \`\` - Main command prefix, check help below`)
                .addField(`Use`, `\`\` ${config.MAIN_PREFIX} <command> \`\``)
                .addField(`Commands`, `\u200B`)
                .addField('`` help/<empty> ``', `Print this message`, true)
                .addField('`` search/[any] ``', `Search for any in-game item`, true)
                .addField('`` level/lvl ``', `Get a leveling guide`, true)
                .addField('`` subscribe ``', `[Owner only] Subscribe current channel to automatically recieve Toram news`, true)
                .addField('\u200B', 'For detailed help, please check https://github.com/Sakagiri/Wiki')
                .addField('Credits', '\u200B')
                .addField(`${config.NAME} (A:${config.VERSION_BOT} - DB:${config.VERSION_DB})`, 'by **acayrin**')
                .addField(`Data source`, `Coryn Club @ Cruithne https://coryn.club/`)
            )

    // ===================================== Main Seach =====================================
    else if ((cmd && !cmds.includes(cmd)) || (cmd === 'search'))
        return require('./SubCommands/Search').search(message, !cmds.includes(cmd) ? check : args)

    // ===================================== Main Level =====================================
    else if (cmd === 'level' || cmd === 'lvl')
        return require('./SubCommands/Level').exec(message, args)

    // ===================================== Main News Sub =====================================
    else if (cmd === 'subscribe')
        if (message.guild.ownerID === message.author.id)
            return require('./NewsAnnouncer').toggle(message)
        else
            return message.channel.send(`You do not have the right permissions`)
    // ===================================== Unknown =====================================
    else
        return message.channel.send(`Unknown command, try \`\` ${config.MAIN_PREFIX} help \`\``)
}

module.exports = {
    execute
}