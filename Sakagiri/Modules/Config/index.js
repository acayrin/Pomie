module.exports = {
    /**
     * Fetch data from url/path
     * @param {String} path url/path to file
     * @returns data object
     */
    load: (path) => require('./Load').load(path),
    /**
     * Restart the app on data change
     * @param {Number} ver version to compare
     * @param {Number} _int interval, in seconds (default 30)
     * @returns () => void
     */
    run: (ver) => require('./Update').run(ver)
}