const Color = require('../ColorManager')
const Emote = require('../EmoteHandler')
const {
    exec
} = require('../Commands/Search')
const Promise = require('bluebird')
const Utils   = require('../Utils')

module.exports.process = async (item, message) => {
    const res = []
    const map = !item.map.toLowerCase().includes('event') ? (await Utils.resolve(exec(message, item.map), 25)).shift() : undefined

    res.push(`> **${item.name}**`)
    res.push(`>  `)
    res.push(`> Type **${item.type}**  -  Id **${item.id}**`)
    res.push(`> ~~                                   ~~`)
    res.push(`> Level **${item.level}**`)
    res.push(`> HP **${item.hp   && item.hp  !== -1 ? item.hp.toLocaleString()  : 'Unknown'}**`)
    res.push(`> EXP **${item.exp && item.exp !== -1 ? item.exp.toLocaleString() : 'Unknown'}**`)
    res.push(`> Element **${item.ele}**`)
    res.push(`> Tamable **${item.tamable}**`)
    res.push(`> ~~                                   ~~`)
    res.push(`> **Spawn at**`)
    res.push(`> ${map ? `[${map.id}] **${map.name}**` : `**${item.map}**`}`)
    res.push(`> ~~                                   ~~`)
    res.push(`> **Item drops** (${item.drops.length} total)`)
    res.push(`>  `)
    for (let i = item.drops.length; --i >= 0;) {
        const drop = (await Utils.resolve(exec(message, item.drops[i].id), 25)).shift()

        const dyes = []
        let codes  = []
        if (item.drops[i].dyes.length > 0) {
            // promise map to reduce load
            await Promise.map(item.drops[i].dyes, async (dye) => {
                const code = await Utils.resolve(Color.bestColor(dye), 25)

                dyes.push(await Utils.resolve(Emote.findEmote(`:${code}:`), 25))
                codes.push(`${`${code}`.replace(/_/g, '')}`)
            }, { concurrency: 1 })
        }

        // print color emojis and codes
        codes = dyes.length > 0 ? `(${dyes.join('')} - ${codes.join(':')})` : ''

        if (drop)
            res.push(`> [${drop.id}] **${drop.name}** (${drop.type}) ${codes}`)
        else
            res.push(`> **${drop.name}** ${codes}`)
    }

    message.channel.send(res.join('\n'))
}
