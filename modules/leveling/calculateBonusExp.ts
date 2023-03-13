import Yujin from "../../../../core/yujin";

export function calculateExpBonus(
	inputLevel: number,
	mod?: Yujin.Mod,
	withDailies: boolean = false,
): number {
	let totalBonus = withDailies ? 50 : 0;
	const targetLevel = inputLevel + 1;

	for (
		let levelCap = mod ? mod.getConfig().level_cap : 255;
		levelCap >= targetLevel;
		levelCap -= 5
	)
		if (
			levelCap &&
			levelCap > 0 &&
			levelCap % 30 === 0 &&
			(targetLevel || 0 < levelCap - 1)
		)
			totalBonus += 9 + levelCap / 30;

	return totalBonus;
}
