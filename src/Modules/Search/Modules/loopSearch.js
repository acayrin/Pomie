module.exports.loopSearch = (string, list) => {
    let i = string.split(' ').length,
        x = list.length
    for (; --i >= 0;)
        for (; --x >= 0;)
            if (!list[x].name.toLowerCase().includes(string.split(' ')[i].toLowerCase()))
                list.splice(x, 1)
    return list
}