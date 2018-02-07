const fs = require('fs')
const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const Packager = require('./packager')
const Util = require('./util')


function start() {

  const html = Util.loadTemplate('dev.html')

  const packager = new Packager()
  packager.load()

  const app = express()
  const server = http.Server(app)
  const io = socketIO(server)

  app.get('/bundle.css', (req, res) => {
    console.log('Serving bundle.css')
    res.type('text/css')
    res.send(packager.getStyles())
  })

  app.get('/bundle.js', (req, res) => {
    const hot = !!req.query.hot
    console.log('Serving bundle.js', hot ? 'hot' : '')
    res.type('application/javascript')
    res.send(getJS(hot))
  })

  app.get('/', (req, res) => {
    res.type('text/html')
    res.send(html)
  })

  fs.watch(Util.APP_PATH, {}, (event, filename) => {
    console.log('Detected a change to "app.js"... reloading')
    reload()
  })

  fs.watch(Util.PAGES_PATH, { recursive: true }, (event, filename) => {
    console.log('Detected a change to "pages"... reloading', filename)
    reload()
  })

  fs.watch(Util.STYLES_PATH, { recursive: true }, (event, filename) => {
    console.log('Detected a change to "styles"... reloading', filename)
    reload()
  })

  io.on('connection', socket => {
    console.log('Connected')
  })

  server.listen(9876, () => {
    console.log('Rush is ready and waiting for you to connect...')
    console.log('Open http://localhost:9876 in your browser to connect...')
  })

  function reload() {
    packager.load()
    console.log('Telling the client to reload...')
    io.emit('reload')
  }

  function getJS(hot) {
    const source = packager.getJS()

    if (hot) {
      return `
        // Clear event listeners
        for (const listener of _listeners) {
          _container.removeEventListener(listener[0], listener[1])
        }

        // Save state and route
        _oldState = Object.assign({}, state)
        _oldRoute = Object.assign({}, currentRoute)

        ${source}

        // Restore state and route
        state = _oldState
        currentRoute = _oldRoute

        // Reload the current page
        show()
      `
    } else {
      return `
        ${packager.getContext()}
        ${source}
      `
    }
  }

}


module.exports = { start }