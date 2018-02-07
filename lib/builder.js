const fs = require('fs')
const rimraf = require('rimraf')
const Packager = require('./packager')


const DIST_DIR = process.cwd() + '/dist/'


function build() {
  console.log('building')

  rimraf.sync(DIST_DIR)

  try {
    fs.mkdirSync(DIST_DIR)
  } catch (e) {
  }

  fs.writeFileSync(DIST_DIR + 'index.html', makeHtml(), {encoding: 'utf-8'})

}


function makeHtml() {
  const packager = new Packager()
  packager.load()

  return `<html>
  <head>
    <style>${packager.getStyles()}</style>
  </head>
  <body>
    <div id="app"></div>

    <script>${packager.getContext()}</script>
    <script>${packager.getJS()}</script>
  </body>
</html>
  `
}


module.exports = { build }