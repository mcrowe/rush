const generator = require('./generator')
const devServer = require('./dev-server')
const builder = require('./builder')


const VERSION = '0.1.8'


module.exports = {
  VERSION,
  createNewApp: generator.createNewApp,
  startDevServer: devServer.start,
  build: builder.build
}