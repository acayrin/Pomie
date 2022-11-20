import { ModCommand } from '../../../core/yujin/mod';
import { printGuide } from '../modules/leveling/printGuide';

export const messageLevel: ModCommand = {
	name: 'level',
	description: [
		'Generate a leveling guide based on given level(s)',
		'Arguments:',
		'``-b`` Filter only boss of any difficulty',
		'``-m`` Filter only miniboss',
		'``-M`` Filter only normal monster',
		'``-n`` Filter only normal difficulty boss',
		'``-h`` Filter only hard difficulty boss',
		'``-nm`` Filter only nightmare difficulty boss',
		'``-u`` Filter only ultimate difficulty boss',
		'``-e <exp_boost>`` NOTE: Slow operation. Bonus EXP % to apply with those from daily emblems and leveling emblems',
	].join('\n'),
	usage: [
		'%prefix%%command%',
		'<current_level>',
		'[target_level]',
		'[-b]',
		'[-m]',
		'[-M]',
		'[-n]',
		'[-h]',
		'[-nm]',
		'[-u]',
		'[-e <bonus_exp>]',
	].join(' '),
	type: 'message',
	process: async (m, o) => {
		printGuide(m, o.args.join(' '), o.mod).catch((e) => m.report(e, __filename));
	},
};
