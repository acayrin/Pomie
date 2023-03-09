import Eris from 'eris';
import Yujin from '../../../../../core/yujin';
import { ToramItem } from '../../../types/item';
import * as Utils from '../../../utils';
import { bestColor as Color } from '../../others/findColor';
import { findEmote as Emote } from '../../others/findEmote';
import { search as Search } from '../query';

export async function displayItem(
	item: ToramItem,
	interaction: Eris.Message | Eris.CommandInteraction,
	mod: Yujin.Mod,
	page = 1,
) {
	const embed = new Eris.Embed().setColor(process.env.YUJIN_COLOR);
	let _upTo = undefined;
	let _upFor = undefined;
	let _baseAtk: string = undefined;
	let _baseDef: string = undefined;
	let _baseStab: string = undefined;

	if (item.proc === 'N/A' || item.proc === 'unknown') {
		item.proc = 'Unknown';
	}
	if (item.sell === '0') {
		item.sell = 'Unknown';
	}

	// item base info
	embed.addField(
		`Type **${item.type}**  -  ID **${item.id}**`,
		[`Sell for *${item.sell}*`, `Process to *${item.proc}*`].join('\n'),
	);

	// item stats
	if (item.stats?.length > 0) {
		const details = [];

		for (const itemStat of item.stats) {
			if (itemStat.includes('Base Stability')) {
				_baseStab = itemStat.match(/\d+/g).shift();
			} else if (itemStat.includes('Base ATK')) {
				_baseAtk = itemStat.match(/\d+/g).shift();
			} else if (itemStat.includes('Base DEF')) {
				_baseDef = itemStat.match(/\d+/g).shift();
			} else if (itemStat.includes('Upgrade for')) {
				_upFor = Utils.filter(
					(await Search(`${itemStat.replace('Upgrade for', '').trim()} --type crysta`, mod)).list,
					(i) => i.id !== item.id,
				).shift();
			} else {
				details.push(`+ ${itemStat}`);
			}
		}

		if (details.join('\n').length > 0) embed.addField('Item stats', details.join('\n'));
	}

	// item uses
	if (item.uses?.length > 0) {
		const details = [];

		for (const use of item.uses) {
			const crystaItem = (await Search(use.for, mod)).list.shift();
			if (crystaItem.type.includes('Crysta')) {
				_upTo = crystaItem;
				item.uses.splice(item.uses.indexOf(use), 1);
			}
		}
		if (item.uses.length > 0) {
			for (const use of item.uses) {
				const synthableItem = (await Search(use.for, mod)).list.shift();
				details.push(
					`[${synthableItem.id}] **${synthableItem.name}** (${synthableItem.type}) (x ${use.amount})`,
				);
			}

			embed.addField('Used for', details.join('\n'));
		}
	}

	// xtal stats
	if (_upTo) {
		embed.addField('Upgrade to', `[${_upTo.id}] **${_upTo.name}** (${_upTo.type})`);
	}
	if (_upFor) {
		embed.addField('Upgrade to', `[${_upFor.id}] **${_upFor.name}** (${_upFor.type})`);
	}

	// item recipe
	if (item.recipe?.set > 0 || item.recipe?.materials?.length > 0) {
		const details = [];

		details.push(`Fee ${item.recipe.fee}`);
		details.push(`Set ${item.recipe.set}`);
		details.push(`Level ${item.recipe.level}`);
		details.push(`Difficulty ${item.recipe.difficulty}`);
		details.push("Materials:");

		for (const material of item.recipe.materials) {
			if (
				material.item.toLowerCase().includes('mana') ||
				material.item.toLowerCase().includes('wood') ||
				material.item.toLowerCase().includes('cloth') ||
				material.item.toLowerCase().includes('metal') ||
				material.item.toLowerCase().includes('beast') ||
				material.item.toLowerCase().includes('medicine')
			) {
				details.push(`+ **${material.item}** (x ${material.amount})`);
			} else {
				const materialLookup = (await Search(material.item, mod)).list.shift();
				details.push(
					`+ [${materialLookup.id}] **${materialLookup.name}** (${materialLookup.type}) (x ${material.amount})`,
				);
			}
		}

		embed.addField('Crafting recpie', details.join('\n'));
	}

	// item drops from
	if (item.drops?.length > 0) {
		const details = [];
		const maxEntriesPerView = 6;
		const pageView =
			item.drops.length > maxEntriesPerView
				? `(${item.drops.length} drops total - page ${page} of ${Math.round(
						item.drops.length / maxEntriesPerView,
				  )})`
				: '';

		if (item.drops.length > maxEntriesPerView && page * maxEntriesPerView - item.drops.length > maxEntriesPerView) {
			details.push("You went a bit too far");
		} else {
			const entryLimit =
				page * maxEntriesPerView > item.drops.length ? item.drops.length : page * maxEntriesPerView;
			const entryStart = (page - 1) * maxEntriesPerView;
			for (let i = entryStart; i < entryLimit; i++) {
				const from = (await Search(item.drops[i].from, mod)).list.shift();
				const line: string[] = [];
				const lineColorEmotes: string[] = [];
				const lineColorCode: string[] = [];

				if (item.drops[i].dyes)
					for (const dye of item.drops[i].dyes) {
						const code = Color(dye);
						lineColorEmotes.push(Emote(`:${code}:`, mod.bot.client));
						lineColorCode.push(code.replace(/_/g, ''));
					}
				if (from) {
					line.push(`[${from.id}] **${from.name}** (${from.type})`);
				} else {
					line.push(`[${item.drops[i].from}]`);
				}
				if (lineColorEmotes.length > 0) {
					line.push(`(${lineColorEmotes.join('')} - ${lineColorCode.join(':')})`);
				}
				details.push(line.join(' '));
			}
		}
		if (item.drops.length > maxEntriesPerView) {
			details.push("");
			details.push("**Note** ");
			details.push(
				`There are more than ${maxEntriesPerView} drops available, use \`\` -s ${item.id} -p [page] \`\` to navigate through the rest`,
			);
		}

		embed.addField(`Obtainable from ${pageView}`, details.join('\n'));
	}

	embed.setTitle(
		`${item.name} ${
			_baseAtk ? `(ATK ${_baseAtk}` : _baseDef ? `(DEF ${_baseDef})` : _baseStab ? `(${_baseStab}%)` : ''
		}`,
	);

	interaction.reply({ embeds: [embed] }).catch((e) => interaction.report(e, __filename));
}
