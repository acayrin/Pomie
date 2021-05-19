const {
    search
} = require('../SubCommands/Search')
const Utils = require('../Utils')

module.exports.process = async (item, message) => {
    const res = []

    res.push(`> **${item.name}**`)
    res.push(`>  `)
    res.push(`> Type **${item.type}**  -  Id **${item.id}**`)
    res.push(`> ~~                                   ~~`)
    res.push(`> **Monsters** (${item.mobs.length} total)`)
    res.push(`>  `)
    for (let i = item.mobs.length; --i >= 0;) {
        const mob = (await Utils.resolve(search(null, `${item.mobs[i]} -t monster;miniboss;boss`), 25)).shift()
        if (mob)
            res.push(`> [${mob.id}] **${mob.name}** (${mob.type})`)
        else
            res.push(`> **${item.mobs[i]}**`)
    }

    message.channel.send(res.join('\n'))
}