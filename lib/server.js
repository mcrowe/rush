const fs = require('fs')
const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')


function start() {

  const app = express()

  app.use(express.static(__dirname + '/public'))

  const pages = {}
  let appSource = ''
  let styles = ''

  const APP_PATH = process.cwd() + '/app.js'
  const PAGES_PATH = process.cwd() + '/pages/'
  const STYLES_PATH = process.cwd() + '/styles/'

  const HTML = loadTemplate('index.html')
  const CONTEXT = loadTemplate('context.js')

  if (!fs.existsSync(APP_PATH)) {
    console.log('This is not a valid rush app directory: "app.js" is missing')
    process.exit(0)
  }

  if (!fs.existsSync(PAGES_PATH)) {
    console.log('This is not a valid rush app directory: "pages" directory is missing')
    process.exit(0)
  }

  if (!fs.existsSync(STYLES_PATH)) {
    console.log('This is not a valid rush app directory: "styles" directory is missing')
    process.exit(0)
  }


  app.get('/bundle.css', (req, res) => {
    console.log('Serving bundle.css')
    res.type('text/css')
    res.send(styles)
  })


  app.get('/bundle.js', (req, res) => {
    const hot = !!req.query.hot
    console.log('Serving bundle.js', hot ? 'hot' : '')
    res.type('application/javascript')
    res.send(makeJSBundle(hot))
  })


  app.get('/', (req, res) => {
    res.type('text/html')
    res.send(HTML)
  })


  loadPages()
  loadApp()
  loadStyles()


  fs.watch(APP_PATH, {}, (event, filename) => {
    console.log('Detected a change to "app.js"... reloading')
    reload()
  })

  fs.watch(PAGES_PATH, { recursive: true }, (event, filename) => {
    console.log('Detected a change to "pages"... reloading', filename)
    reload()
  })

  fs.watch(STYLES_PATH, { recursive: true }, (event, filename) => {
    console.log('Detected a change to "styles"... reloading', filename)
    reload()
  })


  const server = http.Server(app)
  const io = socketIO(server)

  io.on('connection', socket => {
    console.log('Connected')
  })

  server.listen(9876, () => {
    console.log('Rush is ready and waiting for you to connect...')
    console.log('Open http://localhost:9876 in your browser to connect...')
  })

  function loadPages() {
    const filenames = fs.readdirSync(PAGES_PATH)

    for (const filename of filenames) {
      const content = fs.readFileSync(PAGES_PATH + filename, { encoding: 'utf-8' })
      const name = filename.split('.')[0]
      pages[name] = content
    }
  }


  function loadStyles() {
    const filenames = fs.readdirSync(STYLES_PATH)

    for (const filename of filenames) {
      const content = fs.readFileSync(STYLES_PATH + filename, { encoding: 'utf-8' })
      styles += "\n" + content
    }
  }


  function loadApp() {
    try {
      const content = fs.readFileSync(APP_PATH, { encoding: 'utf-8' })
      appSource = content

    } catch (err) {
      console.log("Couldnt find app.js file")
    }
  }


  function loadTemplates() {
    return `
      ;(function () {
        let pages = ${JSON.stringify(pages)}

        for (const name in pages) {
          const page = pages[name]
          _templates[name] = ejs.compile(page, {context: {}})
        }
      }());
    `
  }


  function makeJSBundleLoad() {
    return `
      ${loadTemplates()}
      ${appSource}
    `
  }


  function makeJSBundle(hot) {
    if (hot) {
      return `
        // Clear event listeners
        for (const listener of _listeners) {
          _container.removeEventListener(listener[0], listener[1])
        }

        // Save state and route
        _oldState = Object.assign({}, state)
        _oldRoute = Object.assign({}, currentRoute)

        ${makeJSBundleLoad()}

        // Restore state and route
        state = _oldState
        currentRoute = _oldRoute

        // Reload the current page
        show()
      `
    } else {
      return `
        ${CONTEXT}
        ${makeJSBundleLoad()}
      `
    }
  }

  function reload() {
    loadPages()
    loadApp()
    loadStyles()
    console.log('Telling the client to reload...')
    io.emit('reload')
  }

  function loadTemplate(name) {
    return fs.readFileSync(__dirname + '/template/' + name, { encoding: 'utf-8' })
  }

}


module.exports = { start }