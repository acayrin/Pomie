import Yujin from '../../../../core/yujin';
import * as Utils from '../../utils';
import { calculateExpBonus } from './calculateBonusExp';
import { calculateExpAmount } from './calculateExpAmount';
import { getMonsterList } from './getMonsterList';

type GuideResult = {
	type: 2;
	pm?: boolean;
	startLevel: number;
	endLevel: number;
	totalExp: number;
	bonusExp: number;
	list: {
		startLevel: number;
		endLevel: number;
		bonusExp: number;
		boss: {
			id: string;
			name: string;
			type: string;
			level: number;
			count: number;
			countWb: number;
		}[];
		mini: {
			id: string;
			name: string;
			type: string;
			level: number;
			count: number;
			countWb: number;
		}[];
		norm: {
			id: string;
			name: string;
			type: string;
			level: number;
			count: number;
			countWb: number;
		}[];
	}[];
};
type GuideResultError = {
	type: 3;
	pm?: boolean;
	err: string;
};
type GuideLevelModel = {
	boss: {
		id: string;
		name: string;
		exp: number;
		type: string;
		level: number;
		count: number;
		countWb: number;
	}[];
	mini: {
		id: string;
		name: string;
		exp: number;
		type: string;
		level: number;
		count: number;
		countWb: number;
	}[];
	norm: {
		id: string;
		name: string;
		exp: number;
		type: string;
		level: number;
		count: number;
		countWb: number;
	}[];
};
export type GuideResults = GuideResult | GuideResultError;

const pomieLevelModels: { [key: number]: GuideLevelModel } = {} as any;

/**
 * generates a leveling guide based on given arguments
 *   args: <start_level> [dest_level] [--aditional args]
 *
 *      - start_level: starting level
 *      - dest_level: destination level
 *      - additional args:
 *
 *          -e/--exp: fixed exp bonus, will override --auto
 *          -b/--boss: filter to bosses only
 *          -m/--mini: filter to mini-bosses only
 *          -M/--mob: filter to normal mobs only
 *          -n/--normal: filter to normal bosses only
 *          -h/--hard: filter to hard bosses only
 *          -nm/--nightmare: filter to nightmare bosses only
 *          -u/--ultimate: filter to ultimate bosses only
 * @param {String} args arguments
 * @returns Object containing leveling guide
 */
export function getLevelGuide(args: string, mod: Yujin.Mod): Promise<GuideResults> {
	return new Promise(async (resolve, reject) => {
		// missing arguments
		if (!args) {
			reject({
				type: 3,
				err: 'Missing arguments',
			});
		}

		// variables
		let guideBonus: number;
		let guideFilter: 1 | 2 | 3 | 4 | 5 | 6 | 7;
		let guidePrivate = false;

		// prevent negative values
		let startLevel = Math.abs(Number(args.split(' ')[0]));
		let endLevel = Math.abs(Number(args.split(' ')[1]));

		// reverse if numbers are opposite
		if (endLevel && endLevel < startLevel) {
			const swap = endLevel;
			endLevel = startLevel;
			startLevel = swap;
		}

		// filter through arguments
		const partials = args.split(' ');
		for (const partial of partials) {
			switch (partial) {
				case '-e':
				case '--exp':
					const value = partials[partials.indexOf(partial) + 1];
					if (value && !Number.isNaN(value)) {
						guideBonus = Number(value);
					}
					break;
				case '-b':
				case '--boss':
					guideFilter = 1;
					break;
				case '-m':
				case '--mini':
					guideFilter = 2;
					break;
				case '-n':
				case '--normal':
					guideFilter = 3;
					break;
				case '-h':
				case '--hard':
					guideFilter = 4;
					break;
				case '-nm':
				case '--nightmare':
					guideFilter = 5;
					break;
				case '-u':
				case '--ultimate':
					guideFilter = 6;
					break;
				case '-M':
				case '--mob':
					guideFilter = 7;
					break;
				case '-pm':
					guidePrivate = true;
					break;
				default:
				// empty
			}
		}

		// base guide result
		const guideResult: GuideResults = {
			type: 2,
			pm: guidePrivate,
			startLevel,
			endLevel,
			totalExp: calculateExpAmount(startLevel, endLevel),
			bonusExp: guideBonus > 0 ? guideBonus : undefined,
			list: [],
		};

		// level mapping, store as
		// key: <Level num>
		// value: corresponding boss/miniboss/normal monster of that level
		const levelMap: {
			[key: number]: GuideLevelModel;
		} = {};

		// loop through all the levels
		for (let currentLevel = startLevel; currentLevel <= endLevel; currentLevel++) {
			let levelModel: GuideLevelModel = {} as any;

			// if level model exists and exp bonus is unchanged
			if (!guideBonus && pomieLevelModels[currentLevel]) {
				levelModel = Object.assign(levelModel, pomieLevelModels[currentLevel]);
			} else {
				// get current level exp bonus
				const currentLevelBonus =
					(guideBonus || 0) + calculateExpBonus(currentLevel, mod, guideBonus === undefined);
				// get current level mob list
				const currentLevelList = await getMonsterList(currentLevel, currentLevelBonus, mod);

				// get current level mob entries
				const currentLevelBoss = Utils.filter(currentLevelList, (entry) =>
					entry.monster.type.startsWith('Boss -'),
				);
				const currentLevelMini = Utils.filter(currentLevelList, (entry) =>
					entry.monster.type.startsWith('Mini'),
				);
				const currentLevelNorm = Utils.filter(currentLevelList, (entry) =>
					entry.monster.type.startsWith('Monster'),
				);

				// construct level model
				levelModel = {
					// boss model
					boss:
						currentLevelBoss.length > 0
							? currentLevelBoss.map((entry) => {
									return {
										id: entry.monster.id,
										name: entry.monster.name,
										level: entry.monster.level,
										exp: entry.expWithBonus,
										type: entry.monster.type,
										count: Math.round(calculateExpAmount(currentLevel) / entry.expWithBonus),
										countWb: Math.round(calculateExpAmount(currentLevel) / entry.expWithoutBonus),
									};
							  })
							: undefined,
					// miniboss model
					mini:
						currentLevelMini.length > 0
							? currentLevelMini.map((entry) => {
									return {
										id: entry.monster.id,
										name: entry.monster.name,
										level: entry.monster.level,
										exp: entry.expWithBonus,
										type: entry.monster.type,
										count: Math.round(calculateExpAmount(currentLevel) / entry.expWithBonus),
										countWb: Math.round(calculateExpAmount(currentLevel) / entry.expWithoutBonus),
									};
							  })
							: undefined,
					// normal monster model
					norm:
						currentLevelNorm.length > 0
							? currentLevelNorm.map((entry) => {
									return {
										id: entry.monster.id,
										name: entry.monster.name,
										level: entry.monster.level,
										exp: entry.expWithBonus,
										type: entry.monster.type,
										count: Math.round(calculateExpAmount(currentLevel) / entry.expWithBonus),
										countWb: Math.round(calculateExpAmount(currentLevel) / entry.expWithoutBonus),
									};
							  })
							: undefined,
				};

				// store model on mod initilization
				if (!guideBonus) pomieLevelModels[currentLevel] = levelModel;
			}

			// filter monsters by type
			// miniboss
			if (guideFilter) {
				if (guideFilter === 2) {
					levelModel.boss = [];
					levelModel.norm = [];
				}
				// normal monsters
				if (guideFilter === 7) {
					levelModel.boss = [];
					levelModel.mini = [];
				}
				// any boss
				if ([1, 3, 4, 5, 6].includes(guideFilter)) {
					levelModel.mini = [];
					levelModel.norm = [];
				}
				// boss - normal
				if (guideFilter === 3) {
					levelModel.boss = Array.isArray(levelModel.boss)
						? Utils.filter(levelModel.boss, (entry) => entry.type.includes('Normal'))
						: [];
				}
				// boss - hard
				if (guideFilter === 4) {
					levelModel.boss = Array.isArray(levelModel.boss)
						? Utils.filter(levelModel.boss, (entry) => entry.type.includes('Hard'))
						: [];
				}
				// boss - nightmare
				if (guideFilter === 5) {
					levelModel.boss = Array.isArray(levelModel.boss)
						? Utils.filter(levelModel.boss, (entry) => entry.type.includes('Nightmare'))
						: [];
				}
				// boss - ultimate
				if (guideFilter === 6) {
					levelModel.boss = Array.isArray(levelModel.boss)
						? Utils.filter(levelModel.boss, (entry) => entry.type.includes('Ultimate'))
						: [];
				}
			}

			levelMap[currentLevel] = levelModel;
		}

		// store some data
		const guideData = {
			// list of levels
			levels: Array.from(Object.keys(levelMap)).map((key) => Number(key)),
			// starting level in which preceeding ones have the same value
			fixedLevel: Array.from(Object.keys(levelMap))
				.map((key) => Number(key))
				.at(0),
			// fixed boss data when multiple levels have the same value
			fixedBossData: {
				battleCount: 0,
				battleCountWb: 0,
			},
			// fixed miniboss data when multiple levels have the same value
			fixedMiniData: {
				battleCount: 0,
				battleCountWb: 0,
			},
			// fixed normal monster data when multiple levels have the same value
			fixedNormData: {
				battleCount: 0,
				battleCountWb: 0,
			},
		};

		// loop through list of levels
		let index = -1;
		while (++index < guideData.levels.length) {
			// current level data
			const currentLevel = {
				// level number
				levelNum: guideData.levels.at(index),
				// level monster data
				levelData: levelMap[guideData.levels.at(index)],
				// level exp bonus
				levelExpBonus:
					(guideBonus || 0) + calculateExpBonus(guideData.levels.at(index), mod, guideBonus === undefined),
			};

			// next level data
			const nextLevel = {
				// level number
				levelNum: guideData.levels.at(index + 1),
				// level monster data
				levelData: levelMap[guideData.levels.at(index + 1)],
				// level exp bonus
				levelExpBonus:
					(guideBonus || 0) +
					calculateExpBonus(guideData.levels.at(index + 1), mod, guideBonus === undefined),
			};

			// if next level data doesn't exist, ignore
			if (!nextLevel.levelData) continue;

			// stack up matching data
			{
				// boss battle count
				guideData.fixedBossData.battleCount +=
					currentLevel.levelData.boss && currentLevel.levelData.boss.length > 0
						? currentLevel.levelData.boss.at(0).count > 0
							? currentLevel.levelData.boss.at(0).count
							: 1
						: 0;
				guideData.fixedBossData.battleCountWb +=
					currentLevel.levelData.boss && currentLevel.levelData.boss.length > 0
						? currentLevel.levelData.boss.at(0).countWb > 0
							? currentLevel.levelData.boss.at(0).countWb
							: 1
						: 0;

				// miniboss battle count
				guideData.fixedMiniData.battleCount +=
					currentLevel.levelData.mini && currentLevel.levelData.mini.length > 0
						? currentLevel.levelData.mini.at(0).count > 0
							? currentLevel.levelData.mini.at(0).count
							: 1
						: 0;
				guideData.fixedMiniData.battleCountWb +=
					currentLevel.levelData.mini && currentLevel.levelData.mini.length > 0
						? currentLevel.levelData.mini.at(0).countWb > 0
							? currentLevel.levelData.mini.at(0).countWb
							: 1
						: 0;

				// normal monster battle count
				guideData.fixedNormData.battleCount +=
					currentLevel.levelData.norm && currentLevel.levelData.norm.length > 0
						? currentLevel.levelData.norm.at(0).count > 0
							? currentLevel.levelData.norm.at(0).count
							: 1
						: 0;
				guideData.fixedNormData.battleCountWb +=
					currentLevel.levelData.norm && currentLevel.levelData.norm.length > 0
						? currentLevel.levelData.norm.at(0).countWb > 0
							? currentLevel.levelData.norm.at(0).countWb
							: 1
						: 0;
			}

			// validation between 2 levels
			const validate = {
				// if 2 levels have any different monster entry
				differentMonster:
					currentLevel.levelData.boss?.at(0)?.id !== nextLevel.levelData.boss?.at(0)?.id ||
					currentLevel.levelData.mini?.at(0)?.id !== nextLevel.levelData.mini?.at(0)?.id ||
					currentLevel.levelData.norm?.at(0)?.id !== nextLevel.levelData.norm?.at(0)?.id,

				// if 2 levels have different exp bonus
				differentExpBonus:
					calculateExpBonus(currentLevel.levelNum, mod) !== calculateExpBonus(nextLevel.levelNum, mod),

				// if 2 different level state
				differentLevel: currentLevel.levelNum !== guideData.fixedLevel,

				// if at last level
				atLastLevel: currentLevel.levelNum + 1 === endLevel,
			};

			if (
				validate.atLastLevel ||
				validate.differentExpBonus ||
				(validate.differentMonster && validate.differentLevel)
			) {
				// add new result entry when 2 levels are different or at last level
				guideResult.list.push({
					bonusExp:
						(guideBonus || 0) + calculateExpBonus(currentLevel.levelNum, mod, guideBonus === undefined),
					startLevel: guideData.fixedLevel,
					endLevel: currentLevel.levelNum,
					boss: currentLevel.levelData.boss
						? currentLevel.levelData.boss.map((entry) => {
								return {
									id: entry.id,
									type: entry.type,
									name: entry.name,
									level: entry.level,
									count: guideData.fixedBossData.battleCount,
									countWb: guideData.fixedBossData.battleCountWb,
								};
						  })
						: undefined,
					mini: currentLevel.levelData.mini
						? currentLevel.levelData.mini.map((entry) => {
								return {
									id: entry.id,
									type: entry.type,
									name: entry.name,
									level: entry.level,
									count: guideData.fixedMiniData.battleCount,
									countWb: guideData.fixedMiniData.battleCountWb,
								};
						  })
						: undefined,
					norm: currentLevel.levelData.norm
						? currentLevel.levelData.norm.map((entry) => {
								return {
									id: entry.id,
									type: entry.type,
									name: entry.name,
									level: entry.level,
									count: guideData.fixedNormData.battleCount,
									countWb: guideData.fixedNormData.battleCountWb,
								};
						  })
						: undefined,
				});

				// reset data
				{
					guideData.fixedLevel = nextLevel.levelNum;
					guideData.fixedBossData.battleCount = 0;
					guideData.fixedBossData.battleCountWb = 0;
					guideData.fixedMiniData.battleCount = 0;
					guideData.fixedMiniData.battleCountWb = 0;
					guideData.fixedNormData.battleCount = 0;
					guideData.fixedNormData.battleCountWb = 0;
				}
			}
		}

		resolve(guideResult);
	});
}
