import { ToramItem } from '../../../types/item';
import { ToramMap } from '../../../types/map';
import { ToramMonster } from '../../../types/monster';
import { filter as ufilter } from '../../../utils';

export function filter(name: string, list: (ToramItem | ToramMonster | ToramMap)[]): (ToramItem | ToramMonster | ToramMap)[] {
	let phrase: string;
	const phrases = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
	let results: (ToramItem | ToramMonster | ToramMap)[] = [];

	while ((phrase = phrases.shift())) {
		results = ufilter(list, (item) => new RegExp(phrase, 'i').test(item.name));
	}

	return results;
}
