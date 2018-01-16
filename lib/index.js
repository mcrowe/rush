function createNewApp(appName) {
  console.log('creating app', appName)
}


function startApp() {
  console.log('starting app')
  require('./server')
}


module.exports = { createNewApp, startApp }