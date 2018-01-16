const generator = require('./generator')
const server = require('./server')


module.exports = {
  createNewApp: generator.createNewApp,
  startApp: server.start
}