import { ToramItem } from "../../../types/item";
import { ToramMap } from "../../../types/map";
import { ToramMonster } from "../../../types/monster";
import * as Utils from "../../../utils";

export function filter(
	filters: string[],
	dataList: (ToramItem | ToramMonster | ToramMap)[],
) {
	let results: (ToramItem | ToramMonster | ToramMap)[] = [];

	for (const filter of filters)
		try {
			const filterValue = filter.match(/\d+/g).pop();
			const filterComparator = filter.match(/((<|>)=)|<|>|=/g).shift();
			const filterAttribute = filter
				.replace(filterComparator, "")
				.replace(filterValue, "")
				.trim()
				.toLowerCase();

			results = Utils.filter(dataList, (entry) => {
				// process as Item
				if ((entry as ToramItem).sell !== undefined) {
					entry = entry as ToramItem;

					// compare by sell value
					if (!Number.isNaN(entry.sell) && filterAttribute.includes("sell"))
						return compare(
							entry.sell.toString(),
							filterComparator,
							filterValue,
						);

					// compare by proc value
					if (
						filterAttribute.includes("proc") &&
						/\d+/.test(entry.proc.toString()) &&
						(getType(filterAttribute) ===
							getType(entry.proc.toString().toLowerCase()) ||
							!getType(filterAttribute))
					)
						return compare(
							entry.proc.toString().match(/\d+/)[0],
							filterComparator,
							filterValue,
						);

					// compare by stats
					if (entry.stats && entry.stats.length > 0)
						for (const entryStat of entry.stats) {
							if (!/\d+/g.test(entryStat)) continue;

							const statValue = entryStat.match(/-?\d+/g).pop();
							const statAttribute = entryStat
								.replace(statValue, "")
								.toLowerCase()
								.trim();

							if (statAttribute.includes(filterAttribute))
								return compare(statValue, filterComparator, filterValue);
						}
				}
				if (
					["boss", "monster"].some((type) =>
						entry.type.toLowerCase().includes(type),
					)
				) {
					entry = entry as ToramMonster;

					// filter by HP
					if (filterAttribute.includes("hp") && !Number.isNaN(entry.hp))
						return compare(entry.hp.toString(), filterComparator, filterValue);

					// filter by EXP
					if (filterAttribute.includes("exp") && !Number.isNaN(entry.exp))
						return compare(entry.exp.toString(), filterComparator, filterValue);

					// filter by element
					if (filterAttribute.includes("element"))
						return compare(entry.ele, filterComparator, filterValue);
				}

				return false;
			});
		} catch (_) {}

	return results;
}

function compare(
	atrribute: string,
	comparator: string,
	value: string,
): boolean {
	return eval(`;(function() { return ${atrribute} ${comparator} ${value} })()`);
}

function getType(type: string): string {
	for (const material of [
		"beast",
		"metal",
		"cloth",
		"mana",
		"wood",
		"medicine",
	])
		if (type.includes(material)) return material;

	return undefined;
}
/*
function safeEval(code: string) {
	const sandbox: { [key: string]: any } = {};
	const resultKey = `SAFE_EVAL_${Math.floor(Math.random() * 1000000)}`;
	sandbox[resultKey] = {};
	const clearContext = `
    (function() {
      	Function = undefined;
      	const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
      	keys.forEach((key) => {
        	const item = this[key];
        	if (!item || typeof item.constructor !== 'function') return;
        	this[key].constructor = undefined;
      	});
    })();`;

	code = `${clearContext + resultKey}=${code}`;
	vm.runInNewContext(code, sandbox);
	return sandbox[resultKey];
}*/
