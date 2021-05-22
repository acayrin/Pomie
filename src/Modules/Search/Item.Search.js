const Color = require('../ColorManager')
const Emote = require('../EmoteHandler')
const {
    exec
} = require('../Commands/Search')
const Utils = require('../Utils')

module.exports.process = async (item, message, _page) => {
    const res = []

    let base_atk = undefined
    let base_def = undefined
    let base_stab = undefined
    let up_to = undefined
    let up_for = undefined

    if (item.stats.length > 0) {
        res.push(`> ~~                                   ~~`)
        res.push(`> **Item stats**`)
        res.push(`>  `)
        for (let stat of item.stats) {
            base_stab = stat.includes('Base Stability') ? stat.match(/\d+/g).shift() : base_stab
            base_atk = stat.includes('Base ATK') ? stat.match(/\d+/g).shift() : base_atk
            base_def = stat.includes('Base DEF') ? stat.match(/\d+/g).shift() : base_def

            if (!stat.includes('Base ATK') &&
                !stat.includes('Base DEF') &&
                !stat.includes('Base Stability'))
                if (stat.includes('Upgrade for')) {
                    const xtal = Utils.filter(
                            await exec(null, `${stat.replace('Upgrade for', '').trim()} --type crysta`),
                            i => i.id !== item.id)
                        .shift()
                    up_for = `[${xtal.id}] **${xtal.name}** (${xtal.type})`
                } else
                    res.push(`> + ${stat}`)
        }
    }
    if (item.uses.length > 0) {
        res.push(`> ~~                                   ~~`)
        res.push(`> **Used for**`)
        res.push(`>  `)
        for (let use of item.uses) {
            const _f = (await exec(null, use.for)).shift()
            if (_f.type.includes('Crysta'))
                up_to = `[${_f.id}] **${_f.name}** (${_f.type})`
            else
                res.push(`> [${_f.id}] **${_f.name}** (${_f.type}) (need ${use.amount})`)
        }
    }
    if (up_to || up_for) {
        res.push(`> ~~                                   ~~`)
        if (up_to) {
            res.push(`> **Upgrade to**`)
            res.push(`> + ${up_to}`)
        }
        if (up_to && up_for)
            res.push(`>  `)
        if (up_for) {
            res.push(`> **Upgrade for**`)
            res.push(`> + ${up_for}`)
        }
    }
    if (item.recipe.set > 0 || item.recipe.materials.length > 0) {
        res.push(`> ~~                                   ~~`)
        res.push(`> **Crafting recipe**`)
        res.push(`> Fee ${item.recipe.fee}`)
        res.push(`> Set ${item.recipe.set}`)
        res.push(`> Level ${item.recipe.level}`)
        res.push(`> Difficulty ${item.recipe.difficulty}`)
        res.push(`> Materials:`)
        res.push(`>  `)
        for (let mat of item.recipe.materials) {
            if (mat.item.toLowerCase().includes('mana') ||
                mat.item.toLowerCase().includes('wood') ||
                mat.item.toLowerCase().includes('cloth') ||
                mat.item.toLowerCase().includes('metal') ||
                mat.item.toLowerCase().includes('beast') ||
                mat.item.toLowerCase().includes('medicine'))
                res.push(`> + **${mat.item}** (need ${mat.amount})`)
            else {
                const mm = (await exec(null, mat.item)).shift()
                res.push(`> + [${mm.id}] **${mm.name}** (${mm.type}) (need ${mat.amount})`)
            }
        }
    }

    // title
    res.unshift(`> Process to *${item.proc === 'N/A' || item.proc === 'unknown' ? 'Unknown' : item.proc}*`)
    res.unshift(`> Sell for *${item.sell === '0' ? 'Unknown' : `${item.sell} Spina`}*`)
    res.unshift(`> ~~                                   ~~`)
    res.unshift(`> Type **${item.type}**  -  Id **${item.id}**`)
    res.unshift(`>  `)
    res.unshift(`> **${item.name}**${base_atk ? ` (ATK ${base_atk})` : ''}${base_def ? ` (DEF ${base_def})` : ''}${base_stab ? ` (${base_stab}%)` : ''}`)

    // item drops from
    if (item.drops.length > 0) {
        res.push(`> ~~                                   ~~`)
        res.push(`> **Obtainable from** ${item.drops.length > 10 ? `(${item.drops.length} total - page ${_page} of ${Math.floor(item.drops.length / 10)})` : ''}`)
        res.push(`>  `)

        if (item.drops.length > 10 && item.drops.length - _page * 10 < 0)
            res.push(`> You went a bit too far`)
        else
            for (let i = (_page * 10 > item.drops.length ? item.drops.length : _page * 10); --i >= (_page - 1) * 10;) {
                const from = (await exec(null, item.drops[i].from)).shift()
                const dyes = []
                const codes = []

                if (item.drops[i].dyes.length > 0)
                    for (let dye of item.drops[i].dyes) {
                        const code = Color.bestColor(dye)
                        dyes.push(Emote.findEmote(`:${code}:`))
                        codes.push(code.replace(/_/g, ''))
                    }

                if (res.join('\n').length <= 1900)
                    res.push(`> ${from ? `[${from.id}] **${from.name}** (${from.type})` : `[${item.drops[i].from}]`} ${dyes.length > 0 ? `(${dyes.join('')} - ${codes.join(':')})` : ''}`)
                else
                    message.channel.send(res.join('\n'))
            }
        if (item.drops.length > 10) {
            res.push(`>  `)
            res.push(`> **Note** `)
            res.push(`> There are more than 10 drops available, use \`\` -s ${item.id} -p [page] \`\` to navigate through the rest`)
        }
    }

    message.channel.send(res.join('\n'))
}