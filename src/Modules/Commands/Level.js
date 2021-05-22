const cf = require('../../Config')
const nf = require('node-fetch')

module.exports = {
    name: 'level',
    desc: 'Generate a leveling guide',
    short: 'lvl',
    async exec(message, args) {
        const _user = message.author
        const fetch = JSON.parse(await (await nf(`${cf.API_URL}/level?get=${args}`)).text())
        const res = []
        const chk = []

        res.push(`Exp required for ${fetch.s_lvl} > ${fetch.d_lvl}: ${fetch.t_exp}`)
        if (fetch.b_exp)
            res.push(`Exp bonus +${fetch.b_exp}%`)

        switch (fetch.type) {
            case 1: {
                for (const i of fetch.list) {
                    res.push(` `)
                    res.push(`[${i.id}] ${i.name}`)
                    res.push(` ├── Level ${i.level} - ${i.type}`)
                    res.push(` └── Exp ${i.exp} ~${i.count} times`)
                }
                message.channel.send(`${_user}\`\`\`JSON\n${res.join('\n')}\`\`\``)
                break
            }
            case 2: {
                for (const i of fetch.list) {
                    res.push(` `)
                    res.push(`[Phase #${fetch.list.indexOf(i) + 1}] ${i.s_lvl} > ${i.d_lvl} (+${i.b_exp || fetch.b_exp}%)`)
                    res.push(` │`)
                    if (i.boss) {
                        res.push(` ${i.mini || i.norm ? '├' : '└'}─ [${i.boss.id}] ${i.boss.name}`)
                        res.push(` ${i.mini || i.norm ? '│' : ' '}   │`)
                        res.push(` ${i.mini || i.norm ? '│' : ' '}   ├── Level ${i.boss.level} - ${i.boss.type}`)
                        res.push(` ${i.mini || i.norm ? '│' : ' '}   └── Exp ${i.boss.exp} ~${i.boss.count} times`)
                        res.push(` ${i.mini || i.norm ? '│' : ' '}`)
                    }
                    if (i.mini) {
                        res.push(` ${i.norm ? '├' : '└'}─ [${i.mini.id}] ${i.mini.name}`)
                        res.push(` ${i.norm ? '│' : ' '}   │`)
                        res.push(` ${i.norm ? '│' : ' '}   ├── Level ${i.mini.level} - ${i.mini.type}`)
                        res.push(` ${i.norm ? '│' : ' '}   └── Exp ${i.mini.exp} ~${i.mini.count} times`)
                        res.push(` ${i.norm ? '│' : ' '}`)
                    }
                    if (i.norm) {
                        res.push(` └─ [${i.norm.id}] ${i.norm.name}`)
                        res.push(`     │`)
                        res.push(`     ├── Level ${i.norm.level} - ${i.norm.type}`)
                        res.push(`     └── Exp ${i.norm.exp} ~${i.norm.count} times`)
                    }

                    if (res.join('\n').length > 1500 || fetch.list.indexOf(i) === fetch.list.length - 1) {
                        chk.push(res.join('\n'))
                        res.length = 0
                    }
                }
                for (const c of chk)
                    fetch.pm ?
                        message.author.send(`\`\`\`JSON\n${c}\`\`\``) :
                        message.channel.send(`${_user}\`\`\`JSON\n${c}\`\`\``)
                break
            }
            default:
                message.channel.send(`An unknown error occured`)
        }
    }
}
