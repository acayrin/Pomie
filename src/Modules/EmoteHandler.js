const fs = require('fast-sort')
const cl = require('../Workers/Child')._bot()

module.exports = {
    findEmote (name, _url) {
        const match = name.match(/(:(?![\n])[()#$@-\w]+:)/g)
        const emote = match ? match.shift() : undefined
        const cache = fs.inPlaceSort(cl.emojis.cache).asc(e => e.name)
        const emoji = emote ? cache.find(e => e.name === emote.replace(/:/g, "")) : undefined

        return emoji ? (_url ? emoji.url : `<:${emoji.identifier}>`) : undefined
    }
}