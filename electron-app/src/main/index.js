'use strict'

import {app, BrowserWindow} from 'electron'
import {execFile} from 'child_process'
import {existsSync} from 'fs'

let apiNodeInstance = null

// stubbing out - causes unit test error
// import {initialize} from '../db.js'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Starts the API Node.js Instance.
 */
function startApiNodeInstance () {
  let currentWorkingDirectory = './analysis-lib'
  let apiEntryScript = './api/main.js'
  let nodeForLinuxAndMacFilePath = './node'
  let nodeForWindowsFilePath = './node.exe'
  let nodeForLinuxAndMacExistsOnFolder = existsSync('./analysis-lib/node')
  let nodeForWindowsExistsOnFolder = existsSync('./analysis-lib/node.exe')

  if (process.env.NODE_ENV === 'development') {
    currentWorkingDirectory = '../analysis-lib'
    nodeForLinuxAndMacExistsOnFolder = existsSync('../analysis-lib/node')
    nodeForWindowsExistsOnFolder = existsSync('../analysis-lib/node.exe')
  }

  if (nodeForLinuxAndMacExistsOnFolder || nodeForWindowsExistsOnFolder) {
    if (nodeForLinuxAndMacExistsOnFolder) {
      apiNodeInstance = execFile(nodeForLinuxAndMacFilePath, [apiEntryScript], {cwd: currentWorkingDirectory})
    } else if (nodeForWindowsExistsOnFolder) {
      apiNodeInstance = execFile(nodeForWindowsFilePath, [apiEntryScript], {cwd: currentWorkingDirectory})
    }

    apiNodeInstance.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
  }
}

/**
 * Stops the API Node.js Instance.
 */
function stopApiNodeInstance () {
  if (apiNodeInstance != null) {
    apiNodeInstance.kill()
  }
}

app.on('ready', () => {
  startApiNodeInstance()
  createWindow()
})

app.on('window-all-closed', () => {
  stopApiNodeInstance()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
