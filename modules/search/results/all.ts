import Eris from 'eris';
import { sort } from 'fast-sort';
import { Item } from '../../../types/item';
import { Map } from '../../../types/map';
import { Monster } from '../../../types/monster';

export function displayAll(
	interaction: Eris.Message | Eris.CommandInteraction,
	inputDataList: (Item | Monster | Map)[],
	displayPage: number,
) {
	const dataList = sort(inputDataList).by([
		{ asc: (entry) => entry.id.length },
		{ asc: (entry) => entry.id.match(/\d+/g).shift() },
	]);

	if ((displayPage - 1) * 20 > dataList.length) {
		return interaction.reply('Page does not exist');
	}

	const _curView = displayPage * 20 > dataList.length ? dataList.length : displayPage * 20;
	const _curPage = (displayPage - 1) * 20 + 1;
	const _maxPage = Math.ceil(dataList.length / 20) === 0 ? 1 : Math.ceil(dataList.length / 20);

	const embed = new Eris.Embed()
		.setColor(process.env.YUJIN_COLOR)
		.setTitle(
			`Results **${_curPage}** to **${_curView}** of **${dataList.length}** (page **${displayPage}** of **${_maxPage}**)`,
		)
		.setTimestamp()
		.setFooter('Source: Coryn.club');

	const shownEntryTypes = new Map<string, (Item | Monster | Map)[]>();

	for (let i = (displayPage - 1) * 20; i < displayPage * 20; i++) {
		const entry = dataList[i];

		if (!entry) continue;
		if (!shownEntryTypes.get(entry.type)) shownEntryTypes.set(entry.type, []);

		shownEntryTypes.set(entry.type, shownEntryTypes.get(entry.type).concat(entry));
	}

	for (const entryType of shownEntryTypes.keys()) {
		const entryLines: string[] = [];
		for (const entry of shownEntryTypes.get(entryType)) entryLines.push(`**[${entry.id}]** ${entry.name}`);

		embed.addField(
			`${
				['Miniboss', 'Monster'].includes(entryType)
					? '🐺'
					: entryType.includes('Boss')
					? '🐉'
					: entryType === 'Map'
					? '🗺️'
					: '💰'
			} ${entryType}`,
			entryLines.join('\n'),
		);
	}

	interaction.reply({ embeds: [embed] });
}
