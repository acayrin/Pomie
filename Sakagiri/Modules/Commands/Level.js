module.exports = {
    name: 'level',
    desc: 'Generate a leveling guide',
    short: 'lvl',
    async exec(message, args) {
        const user  = message.author
        const json  = await require('../Level/LevelGuide').getLevelGuide(args)
        const res = []
        const chk = []

        res.push(`Exp required for ${json.s_lvl} > ${json.d_lvl}: ${json.t_exp}`)
        if (json.b_exp) {
            res.push(`Exp bonus +${json.b_exp}%`)
        }

        switch (json.type) {
            case 1: {
                for (const i of json.list) {
                    res.push(` `)
                    res.push(`[${i.id}] ${i.name}`)
                    res.push(` ├── Level ${i.level} - ${i.type}`)
                    res.push(` └── Exp ${i.exp} ~${i.count} times`)
                }
                message.channel.send(`${user}\`\`\`JSON\n${res.join('\n')}\`\`\``)
                break
            }
            case 2: {
                for (const i of json.list) {
                    res.push(` `)
                    res.push(`[Phase #${json.list.indexOf(i) + 1}] ${i.s_lvl} > ${i.d_lvl} (+${i.b_exp || json.b_exp}%)`)
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

                    if (res.join('\n').length > 1500 || json.list.indexOf(i) === json.list.length - 1) {
                        chk.push(res.join('\n'))
                        res.length = 0
                    }
                }
                for (const c of chk) {
                    json.pm ?
                        message.author.send(`\`\`\`JSON\n${c}\`\`\``) :
                        message.channel.send(`${user}\`\`\`JSON\n${c}\`\`\``)
                }
                break
            }
            default:
                message.channel.send(json.err)
        }
    }
}
