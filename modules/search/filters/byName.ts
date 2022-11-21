import { Item } from '../../../types/item';
import { Map } from '../../../types/map';
import { Monster } from '../../../types/monster';
import { filter as ufilter } from '../../../utils';

export function filter(name: string, list: (Item | Monster | Map)[]): (Item | Monster | Map)[] {
	let phrase: string;
	const phrases = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
	let results: (Item | Monster | Map)[] = [];

	while ((phrase = phrases.shift())) {
		results = ufilter(list, (item) => new RegExp(phrase, 'i').test(item.name));
	}

	return results;
}
