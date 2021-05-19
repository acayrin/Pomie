const fsort = require('fast-sort')
const Sakagiri = require('../Worker.Child')
const client = Sakagiri._bot()

// ===================================== Emote =====================================
/**
 *
 * @param {String} name the name of emote (:lol:)
 * @param {Boolean} _url whether to return the url of the emote or not
 * @returns the emote format string or url
 */
module.exports.findEmote = (name, _url) => {
    // regex match emote name :LOL:
    const match = name.match(/(:(?![\n])[()#$@-\w]+:)/g)
    const emote = match ? match.shift() : undefined
    const cache = fsort.inPlaceSort(client.emojis.cache).asc(e => e.name)

    // get the emote
    const emoji = emote ? cache.find(e => e.name === emote.replace(/:/g, "")) : undefined

    // return the emote string
    return emoji ? (_url ? emoji.url : `<:${emoji.identifier}>`) : undefined
}
// ===================================== Emote =====================================