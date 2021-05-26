module.exports.loopType = (type, list) => {
    const _list = []

    for (const _t of type.split(";")) {
        const _type = _t.trim()

        if (/\d|[a-z]/i.test(_type)) {
            let i = list.length
            while (i > 0) {
                i--

                if (_type.startsWith('=') && list[i].type.toLowerCase() === _type.replace(/=/g, '').toLowerCase()) {
                    _list.push(list[i])
                } else if (!_type.startsWith('=')) {
                    for (const part of list[i].type.split(' ')) {
                        for (const part2 of _type.split(' ')) {
                            if (part.match(new RegExp(part2, 'i'))) {
                                _list.push(list[i])
                            }
                        }
                    }
                }
            }
        }
    }

    return _list
}
