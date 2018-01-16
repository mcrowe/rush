const fs = require('fs')


const A = `
<div>
  <h1>A <%= magicCalculation(10) %></h1>
  <p><strong><%= state.counter %></strong></p>
  <button class="show-b">Show B</button>
</div>
`

const B = `
<div>
  <h1>B <%= params.value * 2 %></h1>
  <p><strong><%= state.counter %></strong></p>
  <button class="show-a">Show A</button>
</div>
`

const APP = `
state.counter = 1

helper('magicCalculation', x => {
  return x * 42
})

on('click', '.show-b', () => {
  state.counter += 1
  show('b', {value: 9})
})

on('click', '.show-a', () => {
  state.counter += 1
  show('a')
})

show('a')
`

const STYLE = `
body {
  background-color: #f93;
}
`


function createNewApp(appName) {
  if (fs.existsSync(appName)) {
    console.log(`Directory already exists '${appName}'`)
    process.exit(0)
  }

  fs.mkdirSync(appName)
  fs.mkdirSync(appName + '/pages')
  fs.mkdirSync(appName + '/styles')
  fs.mkdirSync(appName + '/views')

  fs.writeFileSync(appName + '/pages/' + 'a.ejs', A)
  fs.writeFileSync(appName + '/pages/' + 'b.ejs', B)
  fs.writeFileSync(appName + '/styles/index.css', STYLE)
  fs.writeFileSync(appName + '/app.js', APP)
}


module.exports = { createNewApp }