/**
 * Unique an Array
 * @param {Array} a input array
 * @returns unique'd array
 */
export function uniq_fast<T>(a: T[]) {
	const seen: any = {};
	const out = [];
	let j = 0;
	for (const i of a) {
		if (seen[i] !== 1) {
			seen[i] = 1;
			out[j] = i;
			j++;
		}
	}
	return out;
}
/**
 * format seconds to HH:mm:ss
 * @param {Number} time input seconds
 * @returns {String} formatted time
 */
export function time_format(time: number): string {
	time = Math.floor(time);
	const hrs = ~~(time / 3600);
	const mins = ~~((time % 3600) / 60);
	const secs = ~~time % 60;
	let ret = "";
	if (hrs > 0) {
		ret += `${hrs}:${mins < 10 ? "0" : ""}`;
	}
	ret += `${mins}:${secs < 10 ? "0" : ""}`;
	ret += `${secs}`;
	return ret;
}
/**
 * Fast filter an array
 * @param {Array} a input array
 * @param {() => void} cb function used to compare values
 * @returns filtered array
 */
export function filter<T>(a: T[], cb: (i: T) => boolean) {
	const f: typeof a = [];
	for (const b of a) {
		if (cb(b)) {
			f.push(b);
		}
	}
	return f;
}
/**
 * convert rgb color to hex value
 * @param {String} rgb rgb color
 * @returns {String} hex color
 */
export function rgb2hex(rgb: string): string {
	return rgb
		.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
		.slice(1)
		.map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
		.join("");
}
/**
 * compare 2 objects, return true if different, otherwise false
 * @param {Object} _a 1st object
 * @param {Object} _b 2nd object
 * @return {boolean} result
 */
export function diff(_a: any, _b: any): boolean {
	if (_a instanceof Function) {
		if (_b instanceof Function) {
			return _a.toString() === _b.toString();
		}
		return true;
	} else if (!_a || !_b) {
		return _a !== _b;
	} else if (_a === _b || _a.valueOf() === _b.valueOf()) {
		return false;
	} else if (Array.isArray(_a)) {
		if (Array.isArray(_b)) {
			if (_a.sort().length !== _b.sort().length) {
				return true;
			}
			for (const _aa of _a) {
				if (_b.indexOf(_aa) === -1) {
					const test = diff(_b[_a.indexOf(_aa)], _aa);
					if (test) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	} else if (Object.keys(_a).length !== Object.keys(_b).length) {
		return true;
	} else {
		for (const _k in _a) {
			const test = diff(_a[_k], _b[_k]);
			if (test) {
				return true;
			}
		}
	}
	return false;
}
