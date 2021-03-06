const package = require(__dirname + '/../package.json')

const fs = require('fs')


function loadTemplate(name) {
  return fs.readFileSync(__dirname + '/template/' + name, { encoding: 'utf-8' })
}


const VERSION = package.version
const APP_PATH = process.cwd() + '/app.js'
const PAGES_PATH = process.cwd() + '/pages/'
const STYLES_PATH = process.cwd() + '/styles/'


module.exports = {
  loadTemplate,
  VERSION,
  APP_PATH,
  PAGES_PATH,
  STYLES_PATH
}