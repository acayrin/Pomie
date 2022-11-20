import { Item } from '../../../types/item';
import { Map } from '../../../types/map';
import { Monster } from '../../../types/monster';

export function filter(filters: string[], dataList: (Item | Monster | Map)[]) {
	for (const filter of filters)
		try {
			const filterValue = filter.match(/\d+/g).pop();
			const filterComparator = filter.match(/((<|>)=)|<|>|=/g).shift();
			const filterAttribute = filter.replace(filterComparator, '').replace(filterValue, '').trim().toLowerCase();

			dataList = dataList.filter((entry) => {
				// process as Item
				if ((entry as Item).sell !== undefined) {
					entry = entry as Item;

					// compare by sell value
					if (!isNaN(Number(entry.sell)) && filterAttribute.includes('sell'))
						return compare(entry.sell.toString(), filterComparator, filterValue);

					// compare by proc value
					if (
						filterAttribute.includes('proc') &&
						/\d+/.test(entry.proc.toString()) &&
						(getType(filterAttribute) === getType(entry.proc.toString().toLowerCase()) ||
							!getType(filterAttribute))
					)
						return compare(entry.proc.toString().match(/\d+/)[0], filterComparator, filterValue);

					// compare by stats
					if (entry.stats && entry.stats.length > 0)
						for (const entryStat of entry.stats) {
							if (!/\d+/g.test(entryStat)) continue;

							const statValue = entryStat.match(/-?\d+/g).pop();
							const statAttribute = entryStat.replace(statValue, '').toLowerCase().trim();

							if (statAttribute.includes(filterAttribute))
								return compare(statValue, filterComparator, filterValue);
						}
				}
				if (['boss', 'monster'].some((type) => entry.type.toLowerCase().includes(type))) {
					entry = entry as Monster;

					// filter by HP
					if (filterAttribute.includes('hp') && !isNaN(Number(entry.hp)))
						return compare(entry.hp.toString(), filterComparator, filterValue);

					// filter by EXP
					if (filterAttribute.includes('exp') && !isNaN(Number(entry.exp)))
						return compare(entry.exp.toString(), filterComparator, filterValue);

					// filter by element
					if (filterAttribute.includes('element')) return compare(entry.ele, filterComparator, filterValue);
				}

				return false;
			});
		} catch (_) {}

	return dataList;
}

function compare(atrribute: string, comparator: string, value: string): boolean {
	return eval(`module.export = () => { return ${atrribute} ${comparator} ${value} }`)();
}

function getType(type: string): string {
	for (const material of ['beast', 'metal', 'cloth', 'mana', 'wood', 'medicine'])
		if (type.includes(material)) return material;

	return undefined;
}
