import Eris from 'eris';
import { ModCommand } from '../../../core/yujin/mod';
import { search } from '../modules/search/query';
import { displayAll } from '../modules/search/results/all';
import { displayItem } from '../modules/search/results/item';
import { displayMap } from '../modules/search/results/map';
import { displayMonster } from '../modules/search/results/monster';
import { ToramItem } from '../types/item';
import { ToramMap } from '../types/map';
import { ToramMonster } from '../types/monster';

export const slashSearch: ModCommand = {
	name: 'search',
	description: 'Search for information of an item, monster or map',
	type: 'slash',
	options: [
		{
			name: 'query',
			description: 'Search query, like name of the item',
			type: 3,
			required: true,
		},
		{
			name: 'page',
			description: 'Display redults starting from this page',
			type: 3,
		},
		{
			name: 'type',
			description: 'Filter results by item type',
			type: 3,
		},
		{
			name: 'filter',
			description: 'Advanced filters to apply, please refer to the docs for more info',
			type: 3,
		},
	],
	process: async (i, o) => {
		const searchQuery = [
			(o.args.find((z) => z.name === 'query') as Eris.InteractionDataOptionWithValue).value as string,
			o.args.find((z) => z.name === 'page')
				? `--page ${(o.args.find((z) => z.name === 'page') as Eris.InteractionDataOptionWithValue).value}`
				: '',
			o.args.find((z) => z.name === 'type')
				? '--type "' +
				  (o.args.find((z) => z.name === 'type') as Eris.InteractionDataOptionWithValue).value +
				  '"'
				: '',
			o.args.find((z) => z.name === 'filter')
				? '--filter "' +
				  (o.args.find((z) => z.name === 'filter') as Eris.InteractionDataOptionWithValue).value +
				  '"'
				: '',
		]
			.join(' ')
			.trim();

		search(searchQuery, o.mod)
			.then(({ list, page }) => {
				if (list.length === 0) {
					return i.reply('Nothing but dust');
				} else if (list.length > 1) {
					displayAll(i, list, page);
				} else {
					const item = list.shift();
					if (item.id.includes('T')) {
						displayItem(item as ToramItem, i, o.mod, page);
					}
					if (item.id.includes('E')) {
						displayMonster(item as ToramMonster, i, o.mod);
					}
					if (item.id.includes('M')) {
						displayMap(item as ToramMap, i, o.mod);
					}
				}
			})
			.catch((err: string) => i.reply(err));
	},
};
