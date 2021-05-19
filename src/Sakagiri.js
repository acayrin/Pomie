const express   = require('express')
const app       = express()
const Main = require('./Worker.Main')
const Utils = require('./lib/Utils')

app.get('*', (req, res) => res.sendStatus(200))

app.listen(process.env.PORT || 3000, () => {
    // start the webserver
    Utils.log(`Started webserver`, true)

    // start the bot
    Main.start(require('./Config').MAX_THREADS)
})
