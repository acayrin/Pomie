module.exports.loopType = (type, list) => {
    const _list = []

    for (let _type of type.split(";")) {
        _type   = _type.trim()

        if (/\d|[a-z]/i.test(_type))
            for (let i = list.length; --i >= 0;)
                if (_type.startsWith('=') && list[i].type.toLowerCase() === _type.replace(/=/g, '').toLowerCase())
                    _list.push(list[i])

                else if (!_type.startsWith('='))
                    for (let part of list[i].type.split(' '))
                        for (let part2 of _type.split(' '))
                            if (part.match(new RegExp(part2, 'i')))
                                _list.push(list[i])
    }

    return _list
}
