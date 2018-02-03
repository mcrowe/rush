const generator = require('./generator')
const server = require('./server')


const VERSION = '0.1.6'


module.exports = {
  VERSION,
  createNewApp: generator.createNewApp,
  startApp: server.start
}