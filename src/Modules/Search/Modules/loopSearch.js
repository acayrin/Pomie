module.exports.loopSearch = (name, list) => {
    let l = [],
        x = list.length
    while (--x >= 0)
        if (list[x].name.toLowerCase().includes(name.toLowerCase()))
            l.push(list[x])
    return l
}