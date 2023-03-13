import Yujin from "../../../../core/yujin";
import { ToramItem } from "../../types/item";
import { ToramMap } from "../../types/map";
import { ToramMonster } from "../../types/monster";
import { filter as filterByName } from "./filters/byName";
import { filter as filterByStat } from "./filters/byStat";
import { filter as filterByType } from "./filters/byType";

const regexParseArguments = /(?:[^\s"]+|"[^"]*")/g;
const regexParseID = /^(?:[a-z][0-9]+)[a-z0-9]*$/gi;

export function search(
	inputString: string,
	mod: Yujin.Mod,
): Promise<{ page: number; list: (ToramItem | ToramMonster | ToramMap)[] }> {
	return new Promise((resolve, reject) => {
		let dataList = mod.bot.database.get("pomie_index", mod) as (
			| ToramItem
			| ToramMonster
			| ToramMap
		)[];
		let searchType: string = undefined;
		let searchPage = 1;
		let searchFilters: string[] = [];
		let searchQueryArray: string[] = [];

		const searchPartials = inputString.match(regexParseArguments);
		if (searchPartials) {
			let partial: string;
			while ((partial = searchPartials.shift())) {
				switch (partial) {
					// set view page
					case "-p":
					case "--page": {
						const value = searchPartials.shift();

						if (!value) {
							reject(`Missing argument after **${partial}**`);
						}
						if (Number.isNaN(value)) {
							reject(`Invalid page number **${value}**`);
						}

						searchPage = Number(value);

						break;
					}
					// filter items by type
					case "-t":
					case "--type": {
						const value = searchPartials.shift();

						if (!value) {
							reject(`Missing argument after **${partial}**`);
						}

						searchType = value.replace(/"/g, "");

						break;
					}
					// filter items by stats
					case "-f":
					case "--filter": {
						const value = searchPartials.shift();

						if (!value) {
							reject(`Missing argument after **${partial}**`);
						}

						searchFilters = value.replace(/"/g, "").split(";");

						break;
					}
					default:
						searchQueryArray.push(partial);
				}
			}
		}

		// rebuild search query
		const searchQuery = searchQueryArray.join(" ");

		// check if query is an ID
		if (regexParseID.test(searchQuery)) {
			let index = dataList.length;
			while (--index > 0) {
				if (
					dataList.at(index).id.toLowerCase() ===
					searchQuery.match(regexParseID).shift().toLowerCase()
				) {
					resolve({ page: searchPage, list: [dataList.at(index)] });
				}
			}
		}

		// filter result by name, if query is * or 'all', return all entries
		if (searchQuery !== "*" && searchQuery !== "all") {
			dataList = filterByName(searchQuery, dataList);
		}

		// filter by entry type
		if (searchType) {
			dataList = filterByType(searchType, dataList);
		}

		// filter by advanced filters
		if (searchFilters.length > 0) {
			dataList = filterByStat(searchFilters, dataList);
		}

		resolve({ page: searchPage, list: dataList });
	});
}
