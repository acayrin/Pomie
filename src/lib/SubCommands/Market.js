// ===================================== Publish command =====================================
module.exports.publish  = (message, phrase, type)   => require('../Market/Publish').exec(message, phrase, type)
// ===================================== Publish command =====================================


// ===================================== List command =====================================
module.exports.list     = (message, search)         => require('../Market/List').exec(message, search)
// ===================================== List command =====================================


// ===================================== End command =====================================
module.exports.end      = (message, id)             => require('../Market/End').exec(message, id)
// ===================================== End command =====================================


// ===================================== Call command =====================================
module.exports.call     = (message, dest)           => require('../Market/Call').exec(message, dest)
// ===================================== Call command =====================================


// ===================================== Tasks =====================================
module.exports._task    = ()                        => require('../Market/Task').exec()
// ===================================== Tasks =====================================