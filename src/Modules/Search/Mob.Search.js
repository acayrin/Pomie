const Color = require('../ColorManager')
const Emote = require('../EmoteHandler')
const {
    exec
} = require('../Commands/Search')

module.exports.process = async (item, message) => {
    const res = []
    const map = !item.map.toLowerCase().includes('event') ? (await exec(null, item.map)).shift() : undefined

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
    for (let drop of item.drops) {
        const d = (await exec(null, drop.id)).shift()

        const dyes = []
        const codes = []

        if (drop.dyes.length > 0)
            for (let dye of drop.dyes) {
                const code = Color.bestColor(dye)
                dyes.push(Emote.findEmote(`:${code}:`))
                codes.push(code.replace(/_/g, ''))
            }
        
        res.push(`> ${d ? `[${d.id}] **${d.name}** (${d.type})` : `**${drop.name}**`} ${dyes.length > 0 ? `(${dyes.join('')} - ${codes.join(':')})` : ''}`)
    }

    message.channel.send(res.join('\n'))
}