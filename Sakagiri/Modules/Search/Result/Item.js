const Search = require("../Search");
const Utils = require("../../Utils");
const Color = require("../../ColorManager");
const Emote = require("../../EmoteHandler");

module.exports.process = async (item, message, _page) => {
	const res = [];
	let _upTo = undefined;
	let _upFor = undefined;
	let _baseAtk = undefined;
	let _baseDef = undefined;
	let _baseStab = undefined;

	if (item.proc === "N/A" || item.proc === "unknown") {
		item.proc = "Unknown";
	}
	if (item.sell === "0") {
		item.sell = "Unknown";
	}

	// item base info
	res.push(`>  `);
	res.push(`> Type **${item.type}**  -  Id **${item.id}**`);
	res.push(`>  `);
	res.push(`> Sell for *${item.sell}*`);
	res.push(`> Process to *${item.proc}*`);

	// item stats
	if (item.stats.length > 0) {
		res.push(`>  `);
		res.push(`> **Item stats**`);
		res.push(`>  `);
		for (const stat of item.stats) {
			if (stat.includes("Base Stability")) {
				_baseStab = stat.match(/\d+/g).shift();
			} else if (stat.includes("Base ATK")) {
				_baseAtk = stat.match(/\d+/g).shift();
			} else if (stat.includes("Base DEF")) {
				_baseDef = stat.match(/\d+/g).shift();
			} else if (stat.includes("Upgrade for")) {
				_upFor = Utils.filter(
					Search.process(`${stat.replace("Upgrade for", "").trim()} --type crysta`).list,
					(i) => i.id !== item.id
				).shift();
			} else {
				res.push(`> + ${stat}`);
			}
		}
	}

	// item uses
	if (item.uses.length > 0) {
		for (const use of item.uses) {
			const _f = Search.process(use.for).list.shift();
			if (_f.type.includes("Crysta")) {
				_upTo = _f;
				item.uses.splice(item.uses.indexOf(use), 1);
			}
		}
		if (item.uses.length > 0) {
			res.push(`>  `);
			res.push(`> **Used for**`);
			res.push(`>  `);
			for (const use of item.uses) {
				const _f = Search.process(use.for).list.shift();
				res.push(`> [${_f.id}] **${_f.name}** (${_f.type}) (x ${use.amount})`);
			}
		}
	}

	// xtal stats
	if (_upTo || _upFor) {
		res.push(`>  `);
		if (_upTo) {
			res.push(`> **Upgrade to**`);
			res.push(`> + [${_upTo.id}] **${_upTo.name}** (${_upTo.type})`);
		}
		if (_upTo && _upFor) {
			res.push(`>  `);
		}
		if (_upFor) {
			res.push(`> **Upgrade for**`);
			res.push(`> + [${_upFor.id}] **${_upFor.name}** (${_upFor.type})`);
		}
	}

	// item recipe
	if (item.recipe.set > 0 || item.recipe.materials.length > 0) {
		res.push(`>  `);
		res.push(`> **Crafting recipe**`);
		res.push(`>  `);
		res.push(`> Fee ${item.recipe.fee}`);
		res.push(`> Set ${item.recipe.set}`);
		res.push(`> Level ${item.recipe.level}`);
		res.push(`> Difficulty ${item.recipe.difficulty}`);
		res.push(`> Materials:`);
		res.push(`>  `);
		for (const mat of item.recipe.materials) {
			if (
				mat.item.toLowerCase().includes("mana") ||
				mat.item.toLowerCase().includes("wood") ||
				mat.item.toLowerCase().includes("cloth") ||
				mat.item.toLowerCase().includes("metal") ||
				mat.item.toLowerCase().includes("beast") ||
				mat.item.toLowerCase().includes("medicine")
			) {
				res.push(`> + **${mat.item}** (x ${mat.amount})`);
			} else {
				const mm = Search.process(mat.item).list.shift();
				res.push(`> + [${mm.id}] **${mm.name}** (${mm.type}) (x ${mat.amount})`);
			}
		}
	}

	// item drops from
	if (item.drops.length > 0) {
		let view = "";
		if (item.drops.length > 10) {
			view = `(${item.drops.length} total - page ${_page} of ${Math.floor(item.drops.length / 10)})`;
		}

		res.push(`>  `);
		res.push(`> **Obtainable from** ${view}`);
		res.push(`>  `);

		if (item.drops.length > 10 && item.drops.length - _page * 10 < 0) {
			res.push(`> You went a bit too far`);
		} else {
			const _c1 = _page * 10 > item.drops.length ? item.drops.length : _page * 10;
			const _c2 = (_page - 1) * 10;
			for (let i = _c2; i < _c1; i++) {
				const from = Search.process(item.drops[i].from).list.shift();
				const l = [];
				const d = [];
				const c = [];

				for (const dye of item.drops[i].dyes) {
					const code = Color.bestColor(dye);
					d.push(Emote.findEmote(`:${code}:`));
					c.push(code.replace(/_/g, ""));
				}
				if (res.join("\n").length <= 1900) {
					if (from) {
						l.push(`[${from.id}] **${from.name}** (${from.type})`);
					} else {
						l.push(`[${item.drops[i].from}]`);
					}
					if (d.length > 0) {
						l.push(`(${d.join("")} - ${c.join(":")})`);
					}
					res.push(`> ${l.join(" ")}`);
				} else {
					message.channel.send(res.join("\n"));
				}
			}
		}
		if (item.drops.length > 10) {
			res.push(`>  `);
			res.push(`> **Note** `);
			res.push(
				`> There are more than 10 drops available, use \`\` -s ${item.id} -p [page] \`\` to navigate through the rest`
			);
		}
	}

	// item name
	if (_baseAtk) {
		item.name += ` (ATK ${_baseAtk})`;
	}
	if (_baseDef) {
		item.name += ` (DEF ${_baseDef})`;
	}
	if (_baseStab) {
		item.name += ` (${_baseStab}%)`;
	}
	res.unshift(`> **${item.name}**`);

	message.channel.send(res.join("\n"));
};
