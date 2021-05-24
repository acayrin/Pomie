const {
    getMobList
} = require('./MonsterList'),
{
    getExpBonus
} = require('./CalcBonus'),
{
    getExp
} = require('./CalcExp'),
{
    inPlaceSort
} = require('fast-sort'),
Utils   = require('../Utils')

// ===================================== Get detailed list of bosses =====================================
/**
send a detailed leveling guide
*/
module.exports.getLevelGuide = async (args) => {
    // variables
    const _timer = Date.now()
    const res    = {}
    let   _bb    = args
    let   _bonus = 50
    let   _filt  = null

    // prevent negative values
    let level   = Math.abs(Number(_bb.split(' ')[0]))
    let _level  = Math.abs(Number(_bb.split(' ')[1]))

    // filter through arguments
    const _aa = args.split(' ')
    for (const _a of _aa) {
        const _v = _aa[_aa.indexOf(_a) + 1]
        switch (_a) {
            case '-a':
            case '--auto':
                _bonus = 'auto'
                _bb = _bb.replace(_a, '').trim()
                break
            case '-e':
            case '--exp':
                _bonus = Number(_v)
                _bb = _bb.replace(_a, '').replace(_v, '').trim()
                break
            case '-b':
            case '--boss':
                _filt = 1
                _bb = _bb.replace(_a, '').trim()
                break
            case '-m':
            case '--mini':
                _filt = 2
                _bb = _bb.replace(_a, '').trim()
                break
            case '-n':
            case '--normal':
                _filt = 3
                _bb = _bb.replace(_a, '').trim()
                break
            case '-h':
            case '--hard':
                _filt = 4
                _bb = _bb.replace(_a, '').trim()
                break
            case '-nm':
            case '--nightmare':
                _filt = 5
                _bb = _bb.replace(_a, '').trim()
                break
            case '-u':
            case '--ultimate':
                _filt = 6
                _bb = _bb.replace(_a, '').trim()
                break
            case '-M':
            case '--mob':
                _filt = 7
                _bb = _bb.replace(_a, '').trim()
                break
            case '-pm':
                res.pm = true
                break
            default:
                // empty
        }
    }

    // get data
    const total = await getMobList(level, _bonus === 'auto' ? getExpBonus(level) : _bonus)

    // if no result
    if (total.length === 0) {
        return {
            err: 'not found'
        }
    }

    // reverse if numbers are opposite
    if (_level && _level < level) {
        const _cc    = _level
        _level = level
        level  = _cc
    }

    // if 2 levels
    if (level && _level) {
        // limiter
        if (_level - level > 50) {
            _level = Number(level) + 50
        }

        // message
        res.type  = 2
        res.s_lvl = level
        res.d_lvl = _level
        res.t_exp = getExp(level, _level).toLocaleString()
        res.b_exp = !isNaN(_bonus) && _bonus > 0 ? _bonus : undefined
        res.list  = []

        // variables
        let _clevel      = Number(level) // current level
        let _cbonus      = isNaN(_bonus) ? getExpBonus(Number(level)) : _bonus // exp bonus
        let _boss_exp    = 0  // current boss exp
        let _boss_count  = 0  // current boss fight count
        let _mini_exp    = 0  // current miniboss exp
        let _mini_count  = 0  // curent miniboss fight count
        let _norm_exp    = 0  // current normal monster exp
        let _norm_count  = 0  // curent normal monster fight count
        let json         = {} // current level json
        const _alevel    = Number(_level) // dest level

        // loop
        for (let _lvl = Number(level); _lvl < _alevel; _lvl++) {
            // variables
            const _fcount      = (_lvl - _clevel) + 1
            const _ebonus      = _bonus === 'auto' ? getExpBonus(_lvl + 1) : _bonus

            const _mlist       = await getMobList(_lvl,     _cbonus)
            const _mlist_2     = await getMobList(_lvl + 1, _cbonus)

            const _list_boss   = inPlaceSort(_mlist).desc(a   => a[1])
            const _list_boss_2 = inPlaceSort(_mlist_2).desc(a => a[1])

            const _list_mini   = Utils.filter(_mlist  , _au => _au[0].type.includes('Miniboss'))
            const _list_mini_2 = Utils.filter(_mlist_2, _au => _au[0].type.includes('Miniboss'))

            const _list_norm   = Utils.filter(_mlist  , _au => _au[0].type.includes('Monster'))
            const _list_norm_2 = Utils.filter(_mlist_2, _au => _au[0].type.includes('Monster'))

            // get the mobs
            let _boss          = _list_boss[0]   ? _list_boss[0]   : undefined
            let _boss_2        = _list_boss_2[0] ? _list_boss_2[0] : undefined
            let _mini          = _list_mini[0]   ? _list_mini[0]   : undefined
            let _mini_2        = _list_mini_2[0] ? _list_mini_2[0] : undefined
            let _norm          = _list_norm[0]   ? _list_norm[0]   : undefined
            let _norm_2        = _list_norm_2[0] ? _list_norm_2[0] : undefined

            /**
             * apply filter
             *
             * 1 = boss only
             * 2 = mini only
             * 3 = normal mode only
             * 4 = hard mode only
             * 5 = nightmare mode only
             * 6 = ultimate mode only
             * 7 = normal monsters only
             */
            if (_filt) {
                if (_filt === 1 || _filt === 3 || _filt === 4 || _filt === 5 || _filt === 6) {
                    _mini       = undefined
                    _mini_2     = undefined
                    _norm       = undefined
                    _norm_2     = undefined
                }
                if (_filt === 2) {
                    _boss       = undefined
                    _boss_2     = undefined
                    _norm       = undefined
                    _norm_2     = undefined
                }
                if (_filt === 3) {
                    _boss       = (Utils.filter(_mlist, _au => _au[0].type.includes('Boss - Normal')).shift())
                    _boss_2     = (Utils.filter(_mlist_2, _au => _au[0].type.includes('Boss - Normal')).shift())
                }
                if (_filt === 4) {
                    _boss       = (Utils.filter(_mlist, _au => _au[0].type.includes('Boss - Hard')).shift())
                    _boss_2     = (Utils.filter(_mlist_2, _au => _au[0].type.includes('Boss - Hard')).shift())
                }
                if (_filt === 5) {
                    _boss       = (Utils.filter(_mlist, _au => _au[0].type.includes('Boss - Nightmare')).shift())
                    _boss_2     = (Utils.filter(_mlist_2, _au => _au[0].type.includes('Boss - Nightmare')).shift())
                }
                if (_filt === 6) {
                    _boss       = (Utils.filter(_mlist, _au => _au[0].type.includes('Boss - Ultimate')).shift())
                    _boss_2     = (Utils.filter(_mlist_2, _au => _au[0].type.includes('Boss - Ultimate')).shift())
                }
                if (_filt === 7) {
                    _boss       = undefined
                    _boss_2     = undefined
                    _mini       = undefined
                    _mini_2     = undefined
                }
            }

            // stack exp and appearance count
            _boss_exp          = _boss ? _boss_exp   + _boss[1] : 0
            _boss_count        = _boss ? _boss_count + Math.round(getExp(_lvl) / Number(_boss[1])) : 0
            _mini_exp          = _mini ? _mini_exp   + _mini[1] : 0
            _mini_count        = _mini ? _mini_count + Math.round(getExp(_lvl) / Number(_mini[1])) : 0
            _norm_exp          = _norm ? _norm_exp   + _norm[1] : 0
            _norm_count        = _norm ? _norm_count + Math.round(getExp(_lvl) / Number(_norm[1])) : 0

            // if the value of next level is different
            const diff         = ((_boss ? _boss[0].id : undefined)  !== (_boss_2 ? _boss_2[0].id : undefined)) ||
                                 ((_mini ? _mini[0].id : undefined)  !== (_mini_2 ? _mini_2[0].id : undefined)) ||
                                 ((_norm ? _norm[0].id : undefined)  !== (_norm_2 ? _norm_2[0].id : undefined)) ||
                                 (_cbonus                            !== _ebonus)

            // add up the message
            if (_lvl !== _clevel && diff || (_lvl + 1 === _alevel)) {
                // variables
                let _boss_exp_avg = Math.round(_boss_exp / (_fcount === 0 ? 1 : _fcount)).toLocaleString()
                let _mini_exp_avg = Math.round(_mini_exp / (_fcount === 0 ? 1 : _fcount)).toLocaleString()
                let _norm_exp_avg = Math.round(_norm_exp / (_fcount === 0 ? 1 : _fcount)).toLocaleString()

                json.s_lvl = _clevel
                json.d_lvl = _lvl
                json.b_exp = _bonus === 'auto' ? _cbonus : undefined

                // if boss exist
                if (_boss) {
                    json.boss = {
                        id: _boss[0].id,
                        name: _boss[0].name,
                        type: _boss[0].type,
                        level: _boss[0].level,
                        exp: _boss_exp_avg,
                        count: _boss_count === 0 ? 1 : _boss_count
                    }
                }

                // if mini exist
                if (_mini) {
                    json.mini = {
                        id: _mini[0].id,
                        name: _mini[0].name,
                        type: _mini[0].type,
                        level: _mini[0].level,
                        exp: _mini_exp_avg,
                        count: _mini_count === 0 ? 1 : _mini_count
                    }
                }

                // if normal exist
                if (_norm) {
                    json.norm = {
                        id: _norm[0].id,
                        name: _norm[0].name,
                        type: _norm[0].type,
                        level: _norm[0].level,
                        exp: _norm_exp_avg,
                        count: _norm_count === 0 ? 1 : _norm_count
                    }
                }

                // push to list
                res.list.push(json)

                // reset variables
                json           = {}
                _boss_exp      = 0
                _boss_count    = 0
                _mini_exp      = 0
                _mini_count    = 0
                _norm_exp      = 0
                _norm_count    = 0
                _clevel        = _lvl + 1
                _cbonus        = _ebonus
            }
        }
    } else {
        // print the list for single level
        res.type  = 1
        res.s_lvl = level
        res.d_lvl = level + 1
        res.b_exp = isNaN(_bonus) ? getExpBonus(level) : _bonus > 0 ? _bonus : undefined
        res.t_exp = getExp(level).toLocaleString()

        // if filter is applied, then make new array instead
        const _ll = _filt ? (
                        _filt === 1 ? Utils.filter(total, mob => mob[0].type.includes('Boss')) :
                        _filt === 2 ? Utils.filter(total, mob => mob[0].type.includes('Miniboss')) :
                        _filt === 3 ? Utils.filter(total, mob => mob[0].type.includes('Boss - Normal')) :
                        _filt === 4 ? Utils.filter(total, mob => mob[0].type.includes('Boss - Hard')) :
                        _filt === 5 ? Utils.filter(total, mob => mob[0].type.includes('Boss - Nightmare')) :
                        _filt === 6 ? Utils.filter(total, mob => mob[0].type.includes('Boss - Ultimate')) :
                        _filt === 7 ? Utils.filter(total, mob => mob[0].type.includes('Monster')) :
                    total) : total

        // loop
        res.list = []
        for (let i = 0; i < (_ll.length > 10 ? 10 : _ll.length); i++) {
            // variables
            const _fec   = _filt ? _ll[i] : total[i]
            const _json  = _fec[0]
            const _e     = _fec[1]
            const _times = Math.round(getExp(level) / _e)

            // message
            res.list.push({
                id: _json.id,
                name: _json.name,
                level: _json.level,
                type: _json.type,
                exp: _e.toLocaleString(),
                count: _times === 0 ? 1 : _times
            })
        }
    }

    // message
    res.timer = Utils.time_format((Date.now() - _timer) / 1000)
    return res
}
// ===================================== Get detailed list of bosses =====================================
