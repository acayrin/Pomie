/**
 * filter through type(s)
 * @param {String|Array<String>} type type(s) to check
 * @param {Array} list data list
 */
module.exports.loopType = (type, list) => {
    const _list = []

    for (let _type of type.split(";")) {
        // remove excessive spaces
        _type   = _type.trim()

        // check if has valid chars
        if (/\d|[a-z]/i.test(_type))
            // loop through the list
            for (let i = list.length; --i >= 0;)
                // must be equal
                if (_type.startsWith('=') && list[i].type.toLowerCase() === _type.replace(/=/g, '').toLowerCase())
                    _list.push(list[i])

                // else types similar
                else if (!_type.startsWith('='))
                    for (let part of list[i].type.split(' '))
                        for (let part2 of _type.split(' '))
                            // just contain
                            if (part.toLowerCase().includes(part2.toLowerCase()))
                                _list.push(list[i])
    }

    return _list
}
