/**
 * get the exp bonus from a level
 * @param {Number} _level base level
 * @returns {Number} exp bonus
 */
module.exports.getExpBonus = (_level) => {
	let _lvl = Number(_level);

	if (Array.isArray(_level)) {
		for (const _ff of _level) {
			if (!isNaN(_ff)) {
				_lvl = _ff > _lvl ? _ff : _lvl;
			}
		}
	}

	const level = _lvl + 1;
	let _ss = 50;

	for (let _x = require("../../Config").LEVEL_CAP; _x >= level; _x -= 10) {
		if (_x && _x > 0 && _x % 30 === 0) {
			if (level ? level : 0 < _x - 1) {
				_ss += 9 + _x / 30;
			}
		}
	}

	return _ss;
};
