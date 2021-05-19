/**
 *      Configurations
 */
module.exports.NAME                 = 'Sakagiri'
module.exports.COLOR                = '#c91417'
module.exports.VERSION_BOT          = require('../package.json').version
module.exports.VERSION_DB           = require('../package.json').dbversion
module.exports.MAX_THREADS          = 1 //process.env.MAX_THREADS ? process.env.MAX_THREADS : 1
module.exports.DISCORD_BOT_TOKEN    = process.env.DISCORD_BOT_TOKEN
module.exports.REDIS_URL            = process.env.REDIS_URL
module.exports.MAIN_PREFIX          = process.env.PREFIX || '-s'
module.exports.LEVEL_CAP            = 230
module.exports.IGNORE_LEVELING_NAME = ['slayer cherrimoth', 'radibat', 'goldoon', 'chocolate ooze', 'candela', 'adaro', 'megiston', 'noeliel', 'yashiro', 'pom', 'potum', 'narumi', 'felicitoad', 'cookie', 'alfenix', 'usakichi', 'usami', 'baphomela', 'black shadow', 'yule cat']
module.exports.IGNORE_LEVELING_ID   = ['e1296']
module.exports.IGNORE_LEVELING_MAP  = ['m368', 'm320', 'm321', 'm322', 'm323', 'm324', 'm325', 'm326', 'm327', 'm328', 'm329', 'm330', 'm331', 'm332']
