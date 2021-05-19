const fs  = require('fs')
const pkg = require('../../package.json')

/**
 * get a file content
 * @param {String} path file path
 * @returns file content
 */
module.exports.page = (path) => fs.readFileSync(path, 'utf-8')
                                  .replace(/{KOHRI_VER}/g, pkg.version)
                                  .replace(/{DB_VER}/g, pkg.dbversion)
