const Color = require('../ColorManager')
const Emote = require('../EmoteHandler')
const {
    exec
} = require('../Commands/Search')
const Promise = require('bluebird')
const Utils   = require('../Utils')

module.exports.process = async (item, message, _page) => {
    const res     = []

    let base_atk  = undefined
    let base_def  = undefined
    let base_stab = undefined
    let up_to     = undefined
    let up_for    = undefined

    const stats = item.stats
    if (item.stats.length > 0) {
        for (let i = stats.length; --i >= 0;) {
            base_stab = stats[i].includes('Base Stability') ? stats[i].match(/\d+/g).shift() : base_stab
            base_atk  = stats[i].includes('Base ATK')       ? stats[i].match(/\d+/g).shift() : base_atk
            base_def  = stats[i].includes('Base DEF')       ? stats[i].match(/\d+/g).shift() : base_def

            if (stats[i].includes('Base ATK') ||
                stats[i].includes('Base DEF') ||
                stats[i].includes('Base Stability'))
                stats.splice(i, 1)
        }
        if (stats.length > 0) {
            res.push(`> ~~                                   ~~`)
            res.push(`> **Item stats**`)
            res.push(`>  `)

            for (let i = stats.length; --i >= 0;) {
                if (stats[i].includes('Upgrade for')) {
                    const xtal = Utils.filter(await Utils.resolve(exec(null, `${stats[i].replace('Upgrade for', '').trim()} --type crysta`)), i => i.id !== item.id).shift()
                    up_for     = `[${xtal.id}] **${xtal.name}** (${xtal.type})`
                } else
                    res.push(`> + ${stats[i]}`)
            }
        }
    }
    if (item.uses.length > 0) {
        const uses = []

        for (let i = item.uses.length; --i >= 0;) {
            const For = (await Utils.resolve(exec(null, item.uses[i].for))).shift()
            if (For.type.includes('Crysta'))
                up_to = `[${For.id}] **${For.name}** (${For.type})`
            else
                uses.push(`> [${For.id}] **${For.name}** (${For.type}) (need ${item.uses[i].amount})`)
        }

        if (uses.length !== 0) {
            res.push(`> ~~                                   ~~`)
            res.push(`> **Used for**`)
            res.push(`>  `)
            for (let u of uses)
                res.push(u)
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
        for (let i = item.recipe.materials.length; --i >= 0;) {
            if (item.recipe.materials[i].item.toLowerCase().includes('mana')   ||
                item.recipe.materials[i].item.toLowerCase().includes('wood')   ||
                item.recipe.materials[i].item.toLowerCase().includes('cloth')  ||
                item.recipe.materials[i].item.toLowerCase().includes('metal')  ||
                item.recipe.materials[i].item.toLowerCase().includes('beast')  ||
                item.recipe.materials[i].item.toLowerCase().includes('medicine'))
                res.push(`> + **${item.recipe.materials[i].item}** (need ${item.recipe.materials[i].amount})`)
            else {
                const item = (await Utils.resolve(exec(null, item.recipe.materials[i].item), 25)).shift()
                res.push(`> + [${item.id}] **${item.name}** (${item.type}) (need ${item.recipe.materials[i].amount})`)
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
        else for (let i = (_page * 10 > item.drops.length ? item.drops.length : _page * 10); --i >= (_page - 1) * 10;) {
            const from  = (await Utils.resolve(exec(null, item.drops[i].from), 25)).shift()
            const dyes  = []
            const codes = []

            if (item.drops[i].dyes.length > 0) {
                // promise map to reduce load
                await Promise.map(item.drops[i].dyes, async (dye) => {
                    const code = await Utils.resolve(Color.bestColor(dye), 25)

                    dyes.push(await Utils.resolve(Emote.findEmote(`:${code}:`), 25))
                    codes.push(`${`${code}`.replace(/_/g, '')}`)
                }, { concurrency: 1 })
            }

            if (res.join('\n').length <= 1900) {
                if (from)
                    res.push(`> [${from.id}] **${from.name}** (${from.type}) ${dyes.length > 0 ? `(${dyes.join('')} - ${codes.join(':')})` : ''}`)
                else
                    res.push(`> ${item.drops[i].from} ${codes}`)
            } else {
                message.channel.send(res.join('\n'))
                res.length = 0
            }

            codes.length = 0
            dyes.length  = 0
        }
        if (item.drops.length > 10) {
            res.push(`>  `)
            res.push(`> **Note** `)
            res.push(`> There are more than 10 drops available, use \`\` -s ${item.id} -p [page] \`\` to navigate through the rest`)
        }
    }

    message.channel.send(res.join('\n'))
    res.length = 0
}
