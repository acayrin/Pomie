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

    if (item.proc === 'N/A' || item.proc === 'unknown')
        item.proc = 'Unknown'
    if (item.sell === '0')
        item.sell = 'Unknown'

    // item base info
    res.push(`>  `)
    res.push(`> Type **${item.type}**  -  Id **${item.id}**`)
    res.push(`> ~~                                   ~~`)
    res.push(`> Sell for *${item.sell}*`)
    res.push(`> Process to *${item.proc}*`)

    // item stats
    if (item.stats.length > 0) {
        res.push(`> ~~                                   ~~`)
        res.push(`> **Item stats**`)
        res.push(`>  `)
        for (const stat of item.stats) {
            if (stat.includes('Base Stability'))
                base_stab = stat.match(/\d+/g).shift()

            else if (stat.includes('Base ATK'))
                base_atk = stat.match(/\d+/g).shift()

            else if (stat.includes('Base DEF'))
                base_def = stat.match(/\d+/g).shift()

            else if (stat.includes('Upgrade for')) {
                const xtal = Utils.filter(
                        await exec(null, `${stat.replace('Upgrade for', '').trim()} --type crysta`),
                        i => i.id !== item.id)
                    .shift()
                up_for = `[${xtal.id}] **${xtal.name}** (${xtal.type})`

            } else
                res.push(`> + ${stat}`)
        }
    }

    // item uses
    if (item.uses.length > 0) {
        for (const use of item.uses) {
            const _f = (await exec(null, use.for)).shift()
            if (_f.type.includes('Crysta')) {
                up_to = `[${_f.id}] **${_f.name}** (${_f.type})`
                item.uses.splice(item.uses.indexOf(use), 1)
            }
        }
        if (item.uses.length > 0) {
            res.push(`> ~~                                   ~~`)
            res.push(`> **Used for**`)
            res.push(`>  `)
            for (const use of item.uses) {
                const _f = (await exec(null, use.for)).shift()
                res.push(`> [${_f.id}] **${_f.name}** (${_f.type}) (need ${use.amount})`)
            }
        }
    }

    // xtal stats
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

    // item recipe
    if (item.recipe.set > 0 || item.recipe.materials.length > 0) {
        res.push(`> ~~                                   ~~`)
        res.push(`> **Crafting recipe**`)
        res.push(`>  `)
        res.push(`> Fee ${item.recipe.fee}`)
        res.push(`> Set ${item.recipe.set}`)
        res.push(`> Level ${item.recipe.level}`)
        res.push(`> Difficulty ${item.recipe.difficulty}`)
        res.push(`> Materials:`)
        res.push(`>  `)
        for (const mat of item.recipe.materials) {
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

    // item name
    if (base_atk)
        item.name += ` (ATK ${base_atk})`
    if (base_def)
        item.name += ` (DEF ${base_def})`
    if (base_stab)
        item.name += ` (${base_stab}%)`
    res.unshift(`> **${item.name}**`)

    // item drops from
    if (item.drops.length > 0) {
        let view = ''
        if (item.drops.length > 10)
            view = `(${item.drops.length} total - page ${_page} of ${Math.floor(item.drops.length / 10)})`

        res.push(`> ~~                                   ~~`)
        res.push(`> **Obtainable from** ${view}`)
        res.push(`>  `)

        if (item.drops.length > 10 && item.drops.length - _page * 10 < 0)
            res.push(`> You went a bit too far`)

        else
            for (let i = (_page * 10 > item.drops.length ? item.drops.length : _page * 10); --i >= (_page - 1) * 10;) {
                const from = (await exec(null, item.drops[i].from)).shift()
                const l = []
                const d = []
                const c = []

                if (item.drops[i].dyes.length > 0)
                    for (const dye of item.drops[i].dyes) {
                        const code = Color.bestColor(dye)
                        d.push(Emote.findEmote(`:${code}:`))
                        c.push(code.replace(/_/g, ''))
                    }

                if (res.join('\n').length <= 1900) {
                    if (from)
                        l.push(`[${from.id}] **${from.name}** (${from.type})`)
                    else
                        l.push(`[${item.drops[i].from}]`)

                    if (d.length > 0)
                        l.push(`(${d.join('')} - ${c.join(':')})`)

                    res.push(`> ${l.join(' ')}`)

                } else
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