const lm = new Map();
const te = new TextEncoder();
const cf = require("../../../Config");
const db = require("../../Main").client.database;

module.exports = {
	name: "message",
	exec(message) {
		// ignore if bot or not start with prefix/@ping
		if (
			message.author.bot ||
			(message.content.split(" ").shift() !== `<@!${message.client.user.id}>` &&
				message.content.split(" ").shift() !== cf.MAIN_PREFIX)
		) {
			return;

			// if on cooldown
		} else if (Date.now() - lm.get(message.author.id) < cf.COOLDOWN * 1000) {
			message.channel.send(`Help only available once every ${cf.COOLDOWN} seconds`);

			// set cooldown and process message
		} else {
			lm.set(message.author.id, Date.now());

			const wkrs = db.get("Workers");
			const worker = wkrs[Math.floor(Math.random() * wkrs.length)];

			if (worker) {
				worker.postMessage(te.encode(JSON.stringify(message)).buffer);
			}
		}
	},
};
