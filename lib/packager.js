const fs = require('fs')
const ejs = require('ejs')
const Util = require('./util')


const EJS = Util.loadTemplate('ejs.js')
const CONTEXT = Util.loadTemplate('context.js')


class Packager {

  constructor() {
    this.pages = {}
    this.appSource = ''
    this.styles = ''
  }

  load() {
    if (!fs.existsSync(Util.APP_PATH)) {
      console.log('This is not a valid rush app directory: "app.js" is missing')
      process.exit(0)
    }

    if (!fs.existsSync(Util.PAGES_PATH)) {
      console.log('This is not a valid rush app directory: "pages" directory is missing')
      process.exit(0)
    }

    if (!fs.existsSync(Util.STYLES_PATH)) {
      console.log('This is not a valid rush app directory: "styles" directory is missing')
      process.exit(0)
    }

    this.pages = loadPages()
    this.appSource = loadApp()
    this.styles = loadStyles()
  }

  getStyles() {
    return this.styles
  }

  getContext() {
    return `
      // EJS
      ${EJS}

      // Rush Context
      ${CONTEXT}
    `
  }

  getJS() {
    return `
      ;(function () {
        let pages = ${JSON.stringify(this.pages)}

        for (const name in pages) {
          const page = pages[name]
          _templates[name] = ejs.compile(page, {context: {}})
        }
      }());

      ;(function() {
        ${this.appSource}
      })();
    `
  }

}


function loadPages() {
  const pages = {}
  const filenames = fs.readdirSync(Util.PAGES_PATH)

  for (const filename of filenames) {
    const content = fs.readFileSync(Util.PAGES_PATH + filename, { encoding: 'utf-8' })
    const name = filename.split('.')[0]
    pages[name] = content
  }

  return pages
}


function loadStyles() {
  let styles = ''
  const filenames = fs.readdirSync(Util.STYLES_PATH)

  for (const filename of filenames) {
    const content = fs.readFileSync(Util.STYLES_PATH + filename, { encoding: 'utf-8' })
    styles += "\n" + content
  }

  return styles
}


function loadApp() {
  try {
    return fs.readFileSync(Util.APP_PATH, { encoding: 'utf-8' })
  } catch (err) {
    console.log("Couldnt find app.js file")
  }
}


module.exports = Packager