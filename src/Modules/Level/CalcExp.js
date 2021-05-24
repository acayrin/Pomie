module.exports.getExp = (_level, _dlevel) => {
    const O = {
        a   : Number(_level),
        b   : 0,
        c   : Number(_dlevel),
        x   : 0
    }
    O.x = O.c
        ? (O.a**4)/40*0.01+(((O.c-1)*(2*(O.c-1)+1)*O.c*(3*(O.c-1)**2+3*(O.c-1)-1))-O.a*(2*O.a+1)*(O.a+1)*(3*O.a**2+3*O.a-1))/1200+((2*O.a)*(1-O.b/100))+((O.c-1)*O.c-O.a*(O.a+1))
        : 0.025 * O.a ** 4 + 2 * O.a
    return Math.floor(O.x)
}
