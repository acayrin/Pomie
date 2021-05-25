const fs = require('fs')
const pt = require('path')
const de = require('deasync')
const nf = require('node-fetch')
const ut = require('../Utils')

/**
 * Fetch data from url/path
 * @param {String} path url/path to file
 * @returns data object
 */
module.exports.load = (path) => {
    let db = undefined
    // try to fetch the data file via url
    nf(path)
        .then(t => t.text())
        .then(e => {
            db = JSON.parse(e)
            ut.log('Found remote data file')
        })
        .catch(e => {
            // else fetch the data file locally
            try {
                db = JSON.parse(fs.readFileSync(pt.resolve(path), 'utf-8'))
                ut.log('Found local data file')
            } catch (f) {
                // if neither worked
                ut.log(`Failed to load data file`, 3)
                ut.log(`${e}`, 3)
                ut.log(`${f}`, 3)
                process.exit()
            }
        })
    de.loopWhile(() => !db)

    return db
}