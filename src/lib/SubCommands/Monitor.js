const pidusage = require('pidusage')
const bot      = require('../../Worker.Main')
const Utils    = require('../Utils')
let   monitor  = undefined

module.exports.monitor = (msg) => {
    const _res = []

    if (monitor) {
        clearInterval(monitor)
        _res.length = 0
        monitor = undefined
        // clean up
        delete require.cache[require.resolve('pidusage')]
        return msg.channel.send('Stopped monitoring')
    }

    msg.channel.send('Preparing...').then(message => {
        monitor  = setInterval(async () => {
            const cpu = ((await pidusage(process.pid)).cpu / 2).toFixed(2)
            const rss = (process.memoryUsage().rss / 1024 / 1024).toFixed(2)

            _res.push('> ~~                                                    ~~')
            _res.push(`> **Sakagiri version ${require('../../../package.json')['version']}** (Uptime ${Utils.time_format(bot._bot().uptime / 1000)})`)
            const _cpu_row = []
            const _mem_row = []
            for (let x = 1; x <= 20; x++) {
                if (cpu >= x * 5)
                    _cpu_row[x] = ('█')
                else
                    _cpu_row[x] = ('░')
                if (Math.round(rss / 1024 * 100) >= x * 5)
                    _mem_row[x] = ('█')
                else
                    _mem_row[x] = ('░')
            }

            _res.push(`> **CPU** ${_cpu_row.join('')} (${cpu}%)`)
            _res.push(`> **MEM** ${_mem_row.join('')} (${rss}/${process.env.WEB_MEMORY ? process.env.WEB_MEMORY * 2 : 1000} MB)`)
            _res.push('> ~~                                                    ~~')
            _res.push(`> **Workers count** ${bot.Workers.length}`)
            _res.push(`>  `)

            for (let mini of bot.Workload.keys()) {
                const load = Utils.unzip(bot.Workload.get(mini))

                _res.push(`> **[Mini #${mini}]** **C**:${load.cpu}% - **M**:${load.mem}MB - **L**:${load.last} - **T**:${load.promises.length} (L: ${load.promises[load.promises.length - 1] || 'none'})`)

                const mini_cpu_load = []
                const mini_mem_load = []
                for (let x = 1; x <= 20; x++) {
                    // cpu
                    if (load.cpu >= x * 5)
                        mini_cpu_load.push('█')
                    else
                        mini_cpu_load.push('░')
                    // memory
                    if (load.mem >= x * 10)
                        mini_mem_load.push('█')
                    else
                        mini_mem_load.push('░')
                }
                _res.push(`> **CPU** ${mini_cpu_load.join('')} (${load.cpu}%)`)
                _res.push(`> **MEM** ${mini_mem_load.join('')} (${load.mem}/200 MB)`)
                _res.push('> ~~                                                    ~~')
            }

            message.edit(_res.join('\n'))
            _res.length = 0
        }, 3000)
    })
}
