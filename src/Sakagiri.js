const Main = require('./Workers/Main')
const Utils = require('./Modules/Utils') 
const express = require('express')
const app = express()

app.disable("x-powered-by")
app.get('*', (req, res) => res.sendStatus(200))

app.listen(process.env.PORT || 3000, () => {
    // start the webserver
    Utils.log(`Started webserver`, true)

    // start the bot
    Main.start()
})