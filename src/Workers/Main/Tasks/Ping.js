const nf = require('node-fetch')

module.exports = {
    name: 'ping',
    exec() {
        setInterval(() => nf('https://sakagiri.herokuapp.com/'), 300 * 1000)
    }
}
