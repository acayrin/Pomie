const colors=[{code:"1_",color:"fffcfc"},{code:"2_",color:"c8c4c4"},{code:"3_",color:"888484"},{code:"4_",color:"403c3c"},{code:"5_",color:"080404"},{code:"6_",color:"f0b4ac"},{code:"7_",color:"f8cca4"},{code:"8_",color:"f8dca4"},{code:"9_",color:"ffecac"},{code:10,color:"f8fcb4"},{code:11,color:"d8fcac"},{code:12,color:"a8fca4"},{code:13,color:"b0fcbc"},{code:14,color:"a0fce4"},{code:15,color:"a0ece4"},{code:16,color:"a0dcdc"},{code:17,color:"a8cce4"},{code:18,color:"98b4e4"},{code:19,color:"c8bcec"},{code:20,color:"e8b4e4"},{code:21,color:"f8bcd4"},{code:22,color:"f8745c"},{code:23,color:"e89c4c"},{code:24,color:"f0b454"},{code:25,color:"f0dc54"},{code:26,color:"f0fc54"},{code:27,color:"a8fc4c"},{code:28,color:"60f454"},{code:29,color:"50fc9c"},{code:30,color:"58fcdc"},{code:31,color:"58dcec"},{code:32,color:"60acd4"},{code:33,color:"588ce4"},{code:34,color:"506ccc"},{code:35,color:"a86cdc"},{code:36,color:"f06cec"},{code:37,color:"f0749c"},{code:38,color:"ff0404"},{code:39,color:"f05c0c"},{code:40,color:"ff7c0c"},{code:41,color:"f8c40c"},{code:42,color:"f0fc14"},{code:43,color:"78fc04"},{code:44,color:"08fc04"},{code:45,color:"10fc64"},{code:46,color:"08fce4"},{code:47,color:"08b4dc"},{code:48,color:"107cec"},{code:49,color:"0844d4"},{code:50,color:"0804fc"},{code:51,color:"7004ec"},{code:52,color:"f804f4"},{code:53,color:"f00c7c"},{code:54,color:"980404"},{code:55,color:"903404"},{code:56,color:"885404"},{code:57,color:"987404"},{code:58,color:"a09c04"},{code:59,color:"409c04"},{code:60,color:"089c04"},{code:61,color:"089c44"},{code:62,color:"089484"},{code:63,color:"08747c"},{code:64,color:"085484"},{code:65,color:"082c84"},{code:66,color:"082c84"},{code:67,color:"400484"},{code:68,color:"980484"},{code:69,color:"90043c"},{code:70,color:"480404"},{code:71,color:"481c04"},{code:72,color:"482c04"},{code:73,color:"403c04"},{code:74,color:"404c04"},{code:75,color:"185404"},{code:76,color:"085404"},{code:77,color:"085414"},{code:78,color:"084c34"},{code:79,color:"083c3c"},{code:80,color:"082c34"},{code:81,color:"08143c"},{code:82,color:"08043c"},{code:83,color:"180434"},{code:84,color:"480c44"},{code:85,color:"400c14"}]
const Color = new Map(colors.map(c => [c.code, c.color]))

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
