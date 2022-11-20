import Yujin from '../../../../core/yujin';
import { Item } from '../../types/item';
import { Map } from '../../types/map';
import { Monster } from '../../types/monster';
import { filter as filterByName } from './filters/byName';
import { filter as filterByStat } from './filters/byStat';
import { filter as filterByType } from './filters/byType';

const regexParseArguments = /(?:[^\s"]+|"[^"]*")/g;
const regexParseID = /^(?:[a-z][0-9]+)[a-z0-9]*$/gi;

export function search(searchQuery: string, bot: Yujin.Bot): Promise<{ page: number; list: (Item | Monster | Map)[] }> {
	return new Promise((resolve, reject) => {
		let dataList = bot.database.get('pomie_index', undefined) as (Item | Monster | Map)[];
		let searchType: string = undefined;
		let searchPage = 1;
		let searchFilters: string[] = [];

		const searchPartials = searchQuery.match(regexParseArguments);
		if (searchPartials) {
			for (const parial of searchPartials) {
				const value = searchPartials.at(searchPartials.indexOf(parial) + 1);
				switch (parial) {
					// set view page
					case '-p':
					case '--page':
						if (!value) reject(`Missing argument after **${parial}**`);
						if (isNaN(Number(value))) reject(`Invalid page number **${value}**`);

						searchPage = Number(value);

						searchPartials.splice(searchPartials.indexOf(parial), 2);
						searchQuery = searchPartials.join(' ').trim();

						break;
					// filter items by type
					case '-t':
					case '--type':
						if (!value) reject(`Missing argument after **${parial}**`);

						searchType = value.replace(/"/g, '');

						searchPartials.splice(searchPartials.indexOf(parial), 2);
						searchQuery = searchPartials.join(' ').trim();

						break;
					// filter items by stats
					case '-f':
					case '--filter':
						if (!value) reject(`Missing argument after **${parial}**`);

						searchFilters = value.replace(/"/g, '').split(';');

						searchPartials.splice(searchPartials.indexOf(parial), 2);
						searchQuery = searchPartials.join(' ').trim();

						break;
					default:
					// empty
				}
			}
		}

		// check if query is an ID
		if (regexParseID.test(searchQuery)) {
			let dataEntry;
			while ((dataEntry = dataList.shift())) {
				if (dataEntry.id.toLowerCase() === searchQuery.match(regexParseID).shift().toLowerCase()) {
					dataList = [dataEntry];
					break;
				}
			}
		} else if (searchQuery !== '*' && searchQuery !== 'all') {
			// filter result by name, if query is * or 'all', return all entries
			dataList = filterByName(searchQuery, dataList);
		} else {
			// filter by entry type
			if (searchType) dataList = filterByType(searchType, dataList);

			// filter by advanced filters
			if (searchFilters.length > 0) dataList = filterByStat(searchFilters, dataList);
		}

		resolve({ page: searchPage, list: dataList });
	});
}
