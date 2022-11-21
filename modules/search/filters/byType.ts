import { Item } from '../../../types/item';
import { Map } from '../../../types/map';
import { Monster } from '../../../types/monster';

export function filter(typeQuery: string, entryList: (Item | Monster | Map)[]) {
	const matchingEntryList: (Item | Monster | Map)[] = [];

	typeQuery.split(';').forEach((type) => {
		type = type.trim(); // clean up trailing spaces

		if (/\d|[a-z]/i.test(type)) {
			let index = entryList.length;
			while (--index > 0) {
				if (
					type.startsWith('=') && // absolute match
					entryList.at(index).type.toLowerCase() === type.replace(/=/g, '').toLowerCase() // matching type
				) {
					matchingEntryList.push(entryList[index]);
				} else if (!type.startsWith('='))
					entryList
						.at(index)
						.type.split(' ')
						.forEach((entryPartialType) =>
							type.split(' ').forEach((partialType) => {
								if (entryPartialType.match(new RegExp(partialType, 'i')))
									matchingEntryList.push(entryList.at(index));
							}),
						);
			}
		}
	});

	return matchingEntryList;
}
