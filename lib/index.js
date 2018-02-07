const generator = require('./generator')
const devServer = require('./dev-server')
const builder = require('./builder')
const Util = require('./util')


module.exports = {
  VERSION: Util.VERSION,
  createNewApp: generator.createNewApp,
  startDevServer: devServer.start,
  build: builder.build
}