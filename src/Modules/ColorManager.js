const fs = require('lowdb/adapters/FileSync')
const db = require('lowdb')(new fs('./src/Sakagiri.json'))
const list = db.get('colors').value()
const Color = new Map(list.map(c => [c.code, c.color]))

module.exports = {
    bestColor(hex) {
        let diff = 0
        let code = '0_'
        for (const color of Color.keys()) {
            const _diff = this.hexColorDelta(Color.get(color), hex)
            if (_diff > diff) {
                diff = _diff
                code = color
            }
        }
        return code.toString()
    },
    hexColorDelta(hex1, hex2) {
        const r1 = parseInt(hex1.substring(0, 2), 16)
        const g1 = parseInt(hex1.substring(2, 4), 16)
        const b1 = parseInt(hex1.substring(4, 6), 16)

        const r2 = parseInt(hex2.substring(0, 2), 16)
        const g2 = parseInt(hex2.substring(2, 4), 16)
        const b2 = parseInt(hex2.substring(4, 6), 16)

        let r = 255 - Math.abs(r1 - r2)
        let g = 255 - Math.abs(g1 - g2)
        let b = 255 - Math.abs(b1 - b2)

        r /= 255
        g /= 255
        b /= 255
        return (r + g + b) / 3;
    }
}
