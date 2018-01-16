#!/usr/bin/env node


const Rush = require('../lib')

if (process.argv.length < 3) {
  printUsage()
}

const cmd = process.argv[2]

switch (cmd) {
  case 'new':
    const appName = process.argv[3]
    if (!appName) {
      console.log('Please specify the app name')
      printUsage()
    }
    Rush.createNewApp(appName)
    break
  case 'start':
    Rush.startApp()
    break
  default:
    console.log(`Invalid command '${cmd}'`)
    printUsage()
}


function printUsage() {
  console.log(`
Usage:

# Create a new app called "my-app"
rush new my-app

# Start an existing app (when inside the app directory)
rush start
  `)
  process.exit(0)
}