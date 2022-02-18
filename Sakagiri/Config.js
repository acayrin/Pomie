const w = require("worker_threads");
const p = require("../package.json");
const c = require("./Modules/Config");
const d = c.load(process.env.DISCORD_DATA_URL);

/**
 * watch for data version changes
 * note:
 *   this will cause downtime whenever the data file changes
 *   comment the line to disable it
 */
w.isMainThread && c.run(d.version);

/**
 * Configuration variables
 *
 * You may edit these to your likings
 */
module.exports = {
	// discord
	DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN, // discord bot token, from developer portal
	DISCORD_DATA_URL: process.env.DISCORD_DATA_URL, // bot data file, manually generated, can be path to local file or remote url
	DISCORD_MAX_THREADS: process.env.DISCORD_MAX_THREADS || 1, // number of threads to run

	// bot options
	NAME: "Sakagiri", // bot name
	FANCY_NAME: "ＳＡＫＡＧＩＲＩ", // bot fancy name, mainly for 'help' and 'stats' command, fallback to NAME
	COLOR: "#c91417", // bot color, for discord embed
	MAIN_PREFIX: process.env.DISCORD_PREFIX || "-s", // bot command prefix (DISCORD_PREFIX is optional, for local testing)
	COOLDOWN: 3, // bot cooldown between commands, in seconds
	HEROKU: true, // run the bot as heroku dyno (affects maxOldGenerationSizeMb for Worker)

	// toram related
	// by default, the data comes from the data file
	ITEM_INDEX: d.index, // toram items, required (needed for item search and level guide)
	LEVEL_CAP: d.toram.level_cap || 230, // toram level cap, soft required (needed to calculate exp bonus for level guide)
	GAME_TIPS: d.toram.game_tips || [], // toram ingame tips, optional
	IGNORE_LEVELING_ID: d.toram.ignore_leveling_id || [], // toram ignore leveling ids, optional
	IGNORE_LEVELING_NAME: d.toram.ignore_leveling_name || [], // toram ignore leveling name, optional
	IGNORE_LEVELING_MAP: d.toram.ignore_leveling_map || [], // toram ignore leveling maps ids, optional

	// etc (for bot own usage, no need to modify)
	VERSION_BOT: p.version,
	VERSION_DB: d.version,
};
