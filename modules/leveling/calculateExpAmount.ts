export function calculateExpAmount(
	startLevel: number,
	endLevel: number = startLevel + 1,
) {
	let totalExp = 0;

	while (endLevel >= startLevel) {
		totalExp = 0.025 * startLevel ** 4 + 2 * startLevel;
		startLevel++;
	}

	return Math.floor(totalExp);
}
