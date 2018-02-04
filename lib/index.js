const generator = require('./generator')
const server = require('./server')


const VERSION = '0.1.7'


module.exports = {
  VERSION,
  createNewApp: generator.createNewApp,
  startApp: server.start
}