import Eris from "eris";
import { ModCommand } from "../../../core/yujin/mod";
import { printGuide } from "../modules/leveling/printGuide";

export const slashLevel: ModCommand = {
	name: "level",
	description: "Generate a leveling guide based on given level(s)",
	type: "slash",
	options: [
		{
			name: "current_level",
			description: "Your current level",
			type: 4,
			required: true,
		},
		{
			name: "target_level",
			description: "Your target level",
			type: 4,
		},
		{
			name: "filter_type",
			description: "Filter by monster type",
			type: 3,
			choices: [
				{ name: "Boss - Any", value: "--boss" },
				{ name: "Boss - Normal", value: "--normal" },
				{ name: "Boss - Hard", value: "--hard" },
				{ name: "Boss - Nightmare", value: "--nightmare" },
				{ name: "Boss - Ultimate", value: "--ultimate" },
				{ name: "Miniboss", value: "--miniboss" },
				{ name: "Normal monster", value: "--mob" },
			],
		},
		{
			name: "bonus_exp",
			description:
				"NOTE: Slow operation. Bonus EXP % to apply with those from daily emblems and leveling emblems",
			type: 4,
		},
	],
	process: async (i, o) => {
		const options = {
			currentLevel: o.args.find(
				(z) => z.name === "current_level",
			) as Eris.InteractionDataOptionWithValue,
			targetLevel: o.args.find(
				(z) => z.name === "target_level",
			) as Eris.InteractionDataOptionWithValue,
			filterType: o.args.find(
				(z) => z.name === "filter_type",
			) as Eris.InteractionDataOptionWithValue,
			bonusExp: o.args.find(
				(z) => z.name === "bonus_exp",
			) as Eris.InteractionDataOptionWithValue,
		};
		printGuide(
			i,
			[
				options.currentLevel.value,
				options.targetLevel?.value || Number(options.currentLevel.value) + 1,
				options.filterType?.value || "",
				options.bonusExp ? `--exp ${options.bonusExp?.value}` : "",
			].join(" "),
			o.mod,
		).catch((e) => i.report(e, __filename));
	},
};
