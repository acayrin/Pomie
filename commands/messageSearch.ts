import { ModCommand } from '../../../core/yujin/mod';
import { search } from '../modules/search/query';
import { displayAll } from '../modules/search/results/all';
import { displayItem } from '../modules/search/results/item';
import { displayMap } from '../modules/search/results/map';
import { displayMonster } from '../modules/search/results/monster';
import { ToramItem } from '../types/item';
import { ToramMap } from '../types/map';
import { ToramMonster } from '../types/monster';

export const messageSearch: ModCommand = {
	name: 'search',
	description: [
		'Search for information of an item, monster or map',
		'Arguments:',
		'``-p <page>`` Display results at specific page',
		'``-t <type>`` Filter entries by type, can be multiple, seperated by semicolon',
		'``-f <filter>`` Filter entries by stat, can be multiple, seperated by semicolon',
	].join('\n'),
	usage: ['%prefix%%command%', '<search_query (*)>', '[-p <page>]', '[-t <type>]', '[-f <filter>]'].join(' '),
	type: 'message',
	process: async (i, o) => {
		search(o.args.join(' '), o.mod)
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
