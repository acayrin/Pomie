import Eris from 'eris';
import Yujin from '../../../../../core/yujin';
import { Map } from '../../../types/map';
import { search as Search } from '../query';

export async function displayMap(item: Map, interaction: Eris.Message | Eris.CommandInteraction, mod: Yujin.Mod) {
	const monstersFieldValue: string[] = [];
	for (const monster of item.monsters) {
		const monsterLookup = (await Search(`${monster} -t monster;miniboss;boss`, mod)).list.shift();

		if (monsterLookup) {
			monstersFieldValue.push(`> [${monsterLookup.id}] **${monsterLookup.name}** (${monsterLookup.type})`);
		} else {
			monstersFieldValue.push(`> **${monster}**`);
		}
	}

	interaction
		.reply({
			embeds: [
				new Eris.Embed()
					.setTitle(item.name)
					.setColor(process.env.YUJIN_COLOR)
					.setDescription(`Type **${item.type}** - ID **${item.id}**`)
					.addField(`Monsters (${item.monsters.length})`, monstersFieldValue.join('\n')),
			],
		})
		.catch((e) => interaction.report(e, __filename));
}
