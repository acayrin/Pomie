const nf   = require('node-fetch')
const {
    JSDOM
}           = require('jsdom')
const Kohri = require('../Worker.Main')
const Utils = require('./Utils')



// ===================================== Fetcher =====================================
let   CurrentID = undefined // store for easier use
const fetchNews = async () => {
    // get lastest new with its id/title/url
    let $       = require('jquery')(new JSDOM((await (await nf(`http://en.toram.jp/information/?type_code=all`)).text())).window)
    let first   = $("div.useBox > ul").children('li').first()
    let time    = first.find('time').first().text()
    let url     = 'https://en.toram.jp' + first.find('a').first().attr('href')
    let id      = Number(url.match(/\d+/).pop())
    let title   = first.text().replace(/\t/g, '').replace(/\n/g, ' ').replace(time, '').trim()

    // get the news content
    $ = require('jquery')(new JSDOM((await (await nf(`http://en.toram.jp/information/detail/?information_id=${id}`)).text())).window)
    let content = $("div.useBox.newsBox")
    content.children('div.smallTitleLine').remove()
    content.children('script').remove()
    content.children('.subtitle').each(function() {
        $(this).text(`  **${$(this).text()}**\n`)
    })
    content.children('.deluxetitle').each(function() {
        $(this).text(`~~               ~~ **${$(this).text()}** ~~               ~~\n`)
    })
    content.find('.u-table--simple').each(function() {
        $(this).find('tr').each(function() {
            $(this).find('th').each(function() {
                $(this).text(` | **${$(this).text()}** | `)
            })
            $(this).find('td').each(function() {
                $(this).text(` | ${$(this).text()} | `)
            })
            $(this).text(`${$(this).text()}\n`)
        })
    })
    content.find('.btn_back').remove()
    content.find('a[href="#top"]').remove()

    // send to all the channels if news is different
    if (!CurrentID) {
        Utils.log(`News not found, changed to #${id}`)
        CurrentID = id
    } else if (CurrentID !== id) {
        Utils.log(`News updated to #${id}`)
        CurrentID = id
        // get all guilds
        Kohri.client.guilds.fetch().then(Gs => Gs.forEach(G =>
            // get all category-channels              // if it has children                   // get textchannel
            G.channels.fetch().then(chs => chs.forEach(cc => cc.children ? cc.children.forEach(async ch => {
                // if not textchannel
                if (ch.type !== 'text')
                    return
                // if doesn't have manage_webhooks
                if (!G.me.hasPermission("MANAGE_WEBHOOKS"))
                    return
                // get the hook, if any
                let hook = (await ch.fetchWebhooks()).find(hook => hook.owner.id === Kohri.client.user.id)

                if (hook) {
                    let res   = []
                    let lines = content.text().replace(/\n\n+/g, '\n\n').replace(/\t/g, '').trim().split('\n')
                    res.push(`> **${title}**`)
                    res.push(`>  `)

                    for (let x = 0; x < lines.length; x++)
                        if (res.join('\n').length + lines[x].length > 1950) {
                            hook.send(res.join('\n'))
                            res.length = 0
                        }
                        else if (lines[x] !== '')
                            res.push(`> ${lines[x]}`)

                    res.push(`>  `)
                    res.push(`> *Source: ${url}*\n`)
                    hook.send(res)
                }
            }) : null))
        ))
    }
}
// ===================================== Fetcher =====================================



// ===================================== Toggle =====================================
/**
 * Add a channel to list of News Channels
 * @param {String} message  DiscordJS Message
 * @returns
 */
const toggleChannel = async (message) => {
    let hook        = (await message.channel.fetchWebhooks()).find(h => h.name === 'Kohri')

    if (hook)
        // delete hook
        hook.delete().then(() => {
            message.channel.send(`Channel **#${message.channel.name}** has been removed from the list`)
            hook = undefined
        })
    else
        // add hook
        message.channel.createWebhook('Kohri', {
            avatar: 'https://cdn.discordapp.com/avatars/828605986511388733/e3081f5fbfd4656eddcc4a66c418d807.webp'
        }).then(() =>
            message.channel.send(`Added **#${message.channel.name}** to the list`)
        )
}
// ===================================== Toggle =====================================



// ===================================== Exports =====================================
/**
 * Start the news fetcher, every 5 minutes
 * @return {void}
 */
module.exports.start  = () => setInterval(async () => await fetchNews(), 5 * 1000)
/**
 * Add/Remove channel from list
 * @param {String} message DiscordJS Message
 * @returns
 */
module.exports.toggle = (message) => Utils.resolve(toggleChannel(message), 100)
// ===================================== Exports =====================================
