const Color = require('../ColorManager')
const Emote = require('../EmoteHandler')
const {
    exec
} = require('../Commands/Search')

module.exports.process = async (item, message) => {
    const res = []
    let map = item.map
    let exp = 'Unknown'
    let hp  = 'Unknown'
    if (!item.map.toLowerCase().includes('event')) {
        const get = (await exec(null, item.map)).shift()
        map = `[${get.id}] **${get.name}**`
    }
    if (item.hp && item.hp !== -1)
        hp = item.hp.toLocaleString()
    if (item.exp && item.exp !== -1)
        exp = item.exp.toLocaleString()

    res.push(`> **${item.name}**`)
    res.push(`>  `)
    res.push(`> Type **${item.type}**  -  Id **${item.id}**`)
    res.push(`> ~~                                   ~~`)
    res.push(`> Level **${item.level}**`)
    res.push(`> HP **${hp}**`)
    res.push(`> EXP **${exp}**`)
    res.push(`> Element **${item.ele}**`)
    res.push(`> Tamable **${item.tamable}**`)
    res.push(`> ~~                                   ~~`)
    res.push(`> **Spawn at**`)
    res.push(`> ${map}`)
    res.push(`> ~~                                   ~~`)
    res.push(`> **Item drops** (${item.drops.length} total)`)
    res.push(`>  `)
    for (let drop of item.drops) {
        const d = (await exec(null, drop.id)).shift()
        const l = []
        const d = []
        const c = []

        if (drop.dyes.length > 0)
            for (let dye of drop.dyes) {
                const code = Color.bestColor(dye)
                d.push(Emote.findEmote(`:${code}:`))
                c.push(code.replace(/_/g, ''))
            }

        if (d)
            l.push(`[${d.id}] **${d.name}** (${d.type})`)
        else
            l.push(`**${drop.name}**`)
            
        if (dyes.length > 0)
            l.push(`(${dyes.join('')} - ${codes.join(':')})`)

        res.push(`> ${l.join(' ')}`)
    }

    message.channel.send(res.join('\n'))
}
