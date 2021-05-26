const jq = require('jquery')
const ut = require('../Utils')
const nf = require('node-fetch')
const { JSDOM } = require('jsdom')

module.exports = {
    /**
     * fetch data from en.toram.jp and send to all webhooks if different
     * @param {Object} client discord client
     */
    async exec(client) {
        // get lastest new with its id/title/url
        let $ = jq(new JSDOM((await (await nf(`http://en.toram.jp/information/?type_code=all`)).text())).window)
        const first = $("div.useBox > ul").children('li').first()
        const time = first.find('time').first().text()
        const url = 'https://en.toram.jp' + first.find('a').first().attr('href')
        const id = Number(url.match(/\d+/).pop())
        const title = first.text().replace(/\t/g, '').replace(/\n/g, ' ').replace(time, '').trim()

        // get the news content
        $ = jq(new JSDOM((await (await nf(`http://en.toram.jp/information/detail/?information_id=${id}`)).text())).window)
        const content = $("div.useBox.newsBox")
        content.children('div.smallTitleLine').remove()
        content.children('script').remove()
        content.children('.subtitle').each(function () {
            $(this).text(`  **${$(this).text()}**\n`)
        })
        content.children('.deluxetitle').each(function () {
            $(this).text(`~~               ~~ **${$(this).text()}** ~~               ~~\n`)
        })
        content.find('.u-table--simple').each(function () {
            $(this).find('tr').each(function () {
                $(this).find('th').each(function () {
                    $(this).text(` | **${$(this).text()}** | `)
                })
                $(this).find('td').each(function () {
                    $(this).text(` | ${$(this).text()} | `)
                })
                $(this).text(`${$(this).text()}\n`)
            })
        })
        content.find('.btn_back').remove()
        content.find('a[href="#top"]').remove()

        if (!client.database.get('NewsID')) {
            ut.log('News not found')
            client.database.set('NewsID', id)
        }
        if (client.database.get('NewsID') !== id) {
            ut.log(`News changed to ${id}`)
            try {
                client.database.set('NewsID', id)

                client.guilds.fetch().then(Gs => Gs.forEach(G =>
                    G.channels.fetch().then(chs => chs.forEach(cc => cc.children && cc.children.forEach(async ch => {
                        if (ch.type !== 'text') {
                            return
                        }

                        const hook = (await ch.fetchWebhooks()).find(hk => hk.owner && hk.owner.id === client.user.id)

                        if (hook) {
                            const res = []
                            const lines = content.text().replace(/\n\n+/g, '\n\n').replace(/\t/g, '').trim().split('\n')
                            res.push(`> **${title}**`)
                            res.push(`>  `)

                            for (const line of lines) {
                                if (res.join('\n').length + line.length > 1950) {
                                    hook.send(res.join('\n'))
                                    res.length = 0
                                } else if (line !== '') {
                                    res.push(`> ${line}`)
                                }
                            }

                            res.push(`>  `)
                            res.push(`> *Source: ${url}*\n`)

                            hook.send(res)
                        }
                    })))
                ))
            } catch (e) {
                console.log(e)
            }
        }
    }
}
