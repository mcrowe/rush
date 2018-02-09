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

  return `<!doctype html>
<html>
  <head>
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
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