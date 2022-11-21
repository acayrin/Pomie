import Eris from 'eris';
import Yujin from '../../../../../core/yujin';
import { Monster } from '../../../types/monster';
import { bestColor as Color } from '../../others/findColor';
import { findEmote as Emote } from '../../others/findEmote';
import { search as Search } from '../query';

export async function displayMonster(
	item: Monster,
	interaction: Eris.Message | Eris.CommandInteraction,
	mod: Yujin.Mod,
) {
	let monsterMap = item.map;
	let monsterHP = 'Unknown';
	let monsterEXP = 'Unknown';

	// get map
	if (!item.map.toLowerCase().includes('event')) {
		const mapLookup = (await Search(item.map, mod)).list.shift();
		monsterMap = `[${mapLookup.id}] **${mapLookup.name}**`;
	}
	// get localized hp
	if (item.hp && item.hp !== -1) monsterHP = item.hp.toLocaleString();
	// get localized exp
	if (item.exp && item.exp !== -1) monsterEXP = item.exp.toLocaleString();

	const dropFieldValue: string[] = [];
	for (const monsterDrop of item.drops) {
		const dropLookup = (await Search(monsterDrop.id, mod)).list.shift();
		const line: string[] = [];
		const lineEmotes: string[] = [];
		const lineCodes: string[] = [];

		if (monsterDrop.dyes) {
			for (const dropDye of monsterDrop.dyes) {
				const dropDyeCode = Color(dropDye);
				lineEmotes.push(Emote(`:${dropDyeCode}:`, mod.bot.client));
				lineCodes.push(dropDyeCode.replace(/_/g, ''));
			}
		}
		if (dropLookup) {
			line.push(`[${dropLookup.id}] **${dropLookup.name}** (${dropLookup.type})`);
		} else {
			line.push(`**${monsterDrop.id}**`);
		}
		if (lineEmotes.length > 0) {
			line.push(`(${lineEmotes.join('')} - ${lineCodes.join(':')})`);
		}
		dropFieldValue.push(line.join(' '));
	}

	interaction
		.reply({
			embeds: [
				new Eris.Embed()
					.setTitle(item.name)
					.setColor(process.env.YUJIN_COLOR)
					.setDescription(`Type **${item.type}** - ID **${item.id}**`)
					// line 1
					.addField('Level', item.level.toString(), true)
					.addField('\u200B', '\u200B', true)
					.addField('HP', monsterHP, true)
					// line 2
					.addField('EXP', monsterEXP, true)
					.addField('\u200B', '\u200B', true)
					.addField('Tamable', item.tamable, true)
					// line 3
					.addField('Spawn at', monsterMap)
					.addField(`Item drops (${item.drops.length})`, dropFieldValue.join('\n')),
			],
		})
		.catch((e) => interaction.report(e, __filename));
}
