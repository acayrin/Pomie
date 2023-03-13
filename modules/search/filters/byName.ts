import { ToramItem } from "../../../types/item";
import { ToramMap } from "../../../types/map";
import { ToramMonster } from "../../../types/monster";
import { filter as ufilter } from "../../../utils";

export function filter(
	name: string,
	list: (ToramItem | ToramMonster | ToramMap)[],
): (ToramItem | ToramMonster | ToramMap)[] {
	return ufilter(list, (item) => new RegExp(name.trim(), "i").test(item.name));
}
