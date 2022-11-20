import { inPlaceSort } from 'fast-sort';
import Yujin from '../../../../core/yujin';
import { Monster } from '../../types/monster';
import { search } from '../search/query';

export async function getMonsterList(
	level: number,
	bonus: number,
	mod: Yujin.Mod,
): Promise<{ monster: Monster; expWithBonus: number; expWithoutBonus: number }[]> {
	return new Promise(async (resolve) => {
		// variables
		const results: { monster: Monster; expWithBonus: number; expWithoutBonus: number }[] = [];
		const monsterList = (await search('* -t boss;mini;monster', mod.bot)).list;

		// loop
		for (let index = monsterList.length; --index >= 0; ) {
			// variable
			const monsterEntry = monsterList[index] as Monster;

			// ignore event mobs
			if (
				(mod.getConfig().ignored_leveling?.id as string[]).includes(monsterEntry.id) ||
				(mod.getConfig().ignored_leveling?.map as string[]).includes(monsterEntry.map) ||
				(mod.getConfig().ignored_leveling?.name as string[]).includes(monsterEntry.name)
			)
				continue;

			if (monsterEntry.exp === -1) {
				continue;
			}

			const monsterLevel = Number(monsterEntry.level) ? Number(monsterEntry.level) : 1;
			const monsterExp = Number(monsterEntry.exp) ? Number(monsterEntry.exp) : 1;
			const bonusExp = 1 + (bonus || 0) / 100;

			// only allow if level difference is less than 10
			if (Math.abs(monsterLevel - level) < 10) {
				const expMultiplier =
					Math.abs(monsterLevel - level) <= 5
						? 11
						: Math.abs(monsterLevel - level) <= 6
						? 10
						: Math.abs(monsterLevel - level) <= 7
						? 9
						: Math.abs(monsterLevel - level) <= 8
						? 7
						: Math.abs(monsterLevel - level) <= 9
						? 3
						: 1;

				results.push({
					monster: monsterEntry,
					expWithBonus: Math.round(monsterExp * expMultiplier * bonusExp),
					expWithoutBonus: Math.round(monsterExp * expMultiplier),
				});
			}
		}

		resolve(inPlaceSort(results).desc((entry) => entry.expWithBonus));
	});
}
