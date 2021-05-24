const db = JSON.parse(require('fs').readFileSync(`${__dirname}/Sakagiri.json`, 'utf-8'))

module.exports = {
    // credentials
    DISCORD_BOT_TOKEN    : process.env.DISCORD_BOT_TOKEN,

    // bot options
    NAME                 : 'Sakagiri',
    COLOR                : '#c91417',
    MAIN_PREFIX          : process.env.PREFIX || '-s',

    // toram
    LEVEL_CAP            : db.toram.level_cap,
    IGNORE_LEVELING_ID   : db.toram.ignore_leveling_id,
    IGNORE_LEVELING_NAME : db.toram.ignore_leveling_name,
    IGNORE_LEVELING_MAP  : db.toram.ignore_leveling_map,

    // etc
    MAX_THREADS          : process.env.MAX_THREADS || 1,
    VERSION_BOT          : require('../package.json').version,
    VERSION_DB           : db.version
}
