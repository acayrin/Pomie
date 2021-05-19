const Color  = new Map()
const fs     = require('lowdb/adapters/FileSync')
const db     = require('lowdb')(new fs('./src/DB.json'))
const colors = db.get('colors').value()
// set colors and their codes into map
for (let i = colors.length; --i >= 0;)
    Color.set(colors[i].code, colors[i].color)



// ===================================== BestColor =====================================
/**
 * get best matching color for given hex value
 * @param {String} hex color hex
 * @returns id of the color
 */
module.exports.bestColor = (hex) => {
    let diff  = 0
    let code  = '0_'
    // loop through map
    for (let color of Color.keys()) {
        const _diff = this.hexColorDelta(Color.get(color), hex)
        if (_diff > diff) {
            diff = _diff
            code = color
        }
    }

    return code
}
// ===================================== BestColor =====================================



// ===================================== Similarity =====================================
/**
 * check difference between 2 hex colors
 * @param {String} hex1 hex color 1
 * @param {String} hex2 hex color 2
 * @returns the difference between 2 colors, 0 means opposite colors, 1 means same colors
 */
module.exports.hexColorDelta = (hex1, hex2) => {
    // get red/green/blue int values of hex1
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    // get red/green/blue int values of hex2
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    // calculate differences between reds, greens and blues
    let r = 255 - Math.abs(r1 - r2);
    let g = 255 - Math.abs(g1 - g2);
    let b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposit colors, 1 means same colors
    return (r + g + b) / 3;
}
// ===================================== Similarity =====================================
