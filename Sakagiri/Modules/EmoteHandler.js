const fs = require('fast-sort')
const cl = require('../Workers/Child').client

module.exports = {
    /**
     * find an emote from cache
     * @param {String} name name of the emote (:teehee:)
     * @param {Boolean} _url return url of the emote instead?
     * @returns {String} emote raw name or url
     */
    findEmote(name, _url) {
        const match = name.match(/(:(?![\n])[()#$@-\w]+:)/g)
        const emote = match ? match.shift() : undefined
        const cache = fs.inPlaceSort(cl.database.get('Emojis')).asc(e => e.name)
        const emoji = emote ? cache.find(e => e.name === emote.replace(/:/g, "")) : undefined

        if (emoji) {
            return _url ? emoji.url : `<:${emoji.identifier}>`
        } else {
            return 'X'
        }
    }
}
