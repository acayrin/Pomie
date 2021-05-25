const fs = require('fs')
const pt = require('path')
const de = require('deasync')
const nf = require('node-fetch')
const ut = require('./Modules/Utils')
const pk = require('../package.json')

let db   = undefined
// try to fetch the data file via url
nf(process.env.DISCORD_DATA_URL)
    .then(t => t.text())
    .then(e => {
        db = JSON.parse(e)
        ut.log('Found remote data file')
    })
    .catch(e => {
        // else fetch the data file locally
        try {
            db = JSON.parse(fs.readFileSync(pt.resolve(process.env.DISCORD_DATA_URL), 'utf-8'))
            ut.log('Found local data file')
        } catch (f) {
            // if neither worked
            ut.log(`Failed to load data file`, 3)
            ut.log(`${e}`, 3)
            ut.log(`${f}`, 3)
            process.exit()
        }
    })
de.loopWhile(() => !db)



module.exports = {
    // discord
    DISCORD_BOT_TOKEN    : process.env.DISCORD_BOT_TOKEN,       // discord bot token, from developer portal
    DISCORD_DATA_URL     : process.env.DISCORD_DATA_URL,        // bot datafile, manually generated, can be local file or remote url
    DISCORD_MAX_THREADS  : process.env.DISCORD_MAX_THREADS || 2,// number of threads to run

    // bot options
    NAME                 : 'Sakagiri',                          // bot name
    COLOR                : '#c91417',                           // bot color, for discord embed
    MAIN_PREFIX          : process.env.DISCORD_PREFIX || '-s',  // bot command prefix
    HEROKU               : true,                                // run the bot as heroku dyno (affects maxOldGenerationSizeMb for Worker)

    // toram related (optional)
    ITEM_INDEX           : db.index,                            // toram items, DO NOT CHANGE
    LEVEL_CAP            : db.toram.level_cap            || 230,// toram level cap
    GAME_TIPS            : db.toram.game_tips            || [], // toram ingame tips
    IGNORE_LEVELING_ID   : db.toram.ignore_leveling_id   || [], // toram ignore leveling Ids
    IGNORE_LEVELING_NAME : db.toram.ignore_leveling_name || [], // toram ignore leveling name
    IGNORE_LEVELING_MAP  : db.toram.ignore_leveling_map  || [], // toram ignore leveling maps

    // etc (for bot own usage, no need to modify)
    VERSION_BOT          : pk.version,
    VERSION_DB           : db.version
}
