const generator = require('./generator')
const server = require('./server')


const VERSION = '0.1.5'


module.exports = {
  VERSION,
  createNewApp: generator.createNewApp,
  startApp: server.start
}