module.exports = {
    // credentials
    DISCORD_BOT_TOKEN    : process.env.DISCORD_BOT_TOKEN,

    // bot options
    NAME                 : 'Sakagiri',
    COLOR                : '#c91417',
    MAIN_PREFIX          : '-s',

    // etc
    API_URL              : process.env.API_URL || 'https://acay-api.vercel.app',
    MAX_THREADS          : process.env.MAX_THREADS || 1,
    VERSION_BOT          : require('../package.json').version,
    VERSION_DB           : require('../package.json').dbversion,

    // toram
    LEVEL_CAP            : 230,
    IGNORE_LEVELING_NAME : ['slayer cherrimoth', 'radibat', 'goldoon', 'chocolate ooze', 'candela', 'adaro', 'megiston', 'noeliel', 'yashiro', 'pom', 'potum', 'narumi', 'felicitoad', 'cookie', 'alfenix', 'usakichi', 'usami', 'baphomela', 'black shadow', 'yule cat'],
    IGNORE_LEVELING_ID   : ['e1296'],
    IGNORE_LEVELING_MAP  : ['m368', 'm320', 'm321', 'm322', 'm323', 'm324', 'm325', 'm326', 'm327', 'm328', 'm329', 'm330', 'm331', 'm332']
}
