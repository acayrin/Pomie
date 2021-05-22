const Main = require('./Workers/Main')
const express = require('express')
const app = express()

app.disable("x-powered-by")
app.get('*', (req, res) => res.sendStatus(200))

app.listen(process.env.PORT || 3000, () => Main.start())
