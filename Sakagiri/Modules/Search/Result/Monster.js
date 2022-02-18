const Color = require("../../ColorManager");
const Emote = require("../../EmoteHandler");
const Search = require("../Search");

module.exports.process = async (item, message) => {
	const res = [];
	let map = item.map;
	let hp = "Unknown";
	let exp = "Unknown";
	// get map
	if (!item.map.toLowerCase().includes("event")) {
		const get = Search.process(item.map).list.shift();
		map = `[${get.id}] **${get.name}**`;
	}
	// get localized hp
	if (item.hp && item.hp !== -1) {
		hp = item.hp.toLocaleString();
	}
	// get localized exp
	if (item.exp && item.exp !== -1) {
		exp = item.exp.toLocaleString();
	}

	res.push(`> **${item.name}**`);
	res.push(`>  `);
	res.push(`> Type **${item.type}**  -  Id **${item.id}**`);
	res.push(`>  `);
	res.push(`> Level **${item.level}**`);
	res.push(`> HP **${hp}**`);
	res.push(`> EXP **${exp}**`);
	res.push(`> Element **${item.ele}**`);
	res.push(`> Tamable **${item.tamable}**`);
	res.push(`>  `);
	res.push(`> **Spawn at**`);
	res.push(`> ${map}`);
	res.push(`>  `);
	res.push(`> **Item drops** (${item.drops.length} total)`);
	res.push(`>  `);
	for (const drop of item.drops) {
		const e = Search.process(drop.id).list.shift();
		const l = [];
		const d = [];
		const c = [];

		for (const dye of drop.dyes) {
			const code = Color.bestColor(dye);
			d.push(Emote.findEmote(`:${code}:`));
			c.push(code.replace(/_/g, ""));
		}
		if (e) {
			l.push(`[${e.id}] **${e.name}** (${e.type})`);
		} else {
			l.push(`**${drop.name}**`);
		}
		if (d.length > 0) {
			l.push(`(${d.join("")} - ${c.join(":")})`);
		}
		res.push(`> ${l.join(" ")}`);
	}

	message.channel.send(res.join("\n"));
};
