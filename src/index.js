// require('./lib/alias/hijacker')(require('path').resolve(__dirname, '../'))
const FlipBox = require('./core/FlipBox')
const cli = require('./hubs/CliHub')

exports.cli = cli
exports.helpers = FlipBox.helpers
exports.flags = FlipBox.flags
// exports.isWebpackCli = FlipBox.isWebpackCli
// exports.fuseCommander = FlipBox.fuseCommander
// exports.arithmetics = FlipBox.helpers.arithmetics
exports['default'] = FlipBox

module.exports = FlipBox.helpers.es5exports(exports['default'], exports)
// module.exports = FlipBox
