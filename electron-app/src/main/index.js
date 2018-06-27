'use strict'

import { app, BrowserWindow, dialog } from 'electron'
import { spawn } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'
import { platform } from 'os'

let apiNodeInstance = null

// stubbing out - causes unit test error
// import {initialize} from '../db.js'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

async function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    icon: path.join(__dirname, '..', '..', 'build', 'icons', '64x64.png')
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (platform() === 'win32') {
    mainWindow.webContents.session.on('will-download', (event, downloadItem) => {
      var fileName = dialog.showSaveDialog({
        defaultPath: `musical-turk-report-${new Date().valueOf()}.tsv`,
        filters: [{ name: 'Excel', extensions: ['tsv'] }]
      })

      if (typeof fileName === 'undefined') {
        downloadItem.cancel()
      } else {
        downloadItem.setSavePath(fileName)
      }
    })
  }
}

/**
 * Starts the API Node.js Instance.
 */
async function startApiNodeInstance () {
  let currentWorkingDirectory = './'

  let nodeForLinuxFilePath = './analysis-lib'
  let nodeForLinuxExistsOnFolder = existsSync(nodeForLinuxFilePath)

  let nodeForMacFilePath = path.join(app.getAppPath(), '..', '..', 'analysis-lib')
  let nodeForMacExistsOnFolder = existsSync(nodeForMacFilePath)

  let nodeForWindowsFilePath = './analysis-lib.exe'
  let nodeForWindowsExistsOnFolder = existsSync(nodeForWindowsFilePath)

  if (nodeForLinuxExistsOnFolder || nodeForMacExistsOnFolder || nodeForWindowsExistsOnFolder) {
    if (nodeForLinuxExistsOnFolder) {
      apiNodeInstance = spawn(nodeForLinuxFilePath, { cwd: currentWorkingDirectory })
    } else if (nodeForMacExistsOnFolder) {
      apiNodeInstance = spawn(nodeForMacFilePath, { cwd: path.dirname(nodeForMacFilePath) })
    } else if (nodeForWindowsExistsOnFolder) {
      apiNodeInstance = spawn(nodeForWindowsFilePath, { cwd: currentWorkingDirectory })
    }

    apiNodeInstance.stdout.on('data', (data) => {
      console.log(`[analysis-lib] ${data}`)
    })

    apiNodeInstance.stderr.on('data', (data) => {
      console.log(`[analysis-lib] Error: ${data}`)
    })

    apiNodeInstance.on('close', (code) => {
      console.log(`[analysis-lib] Exited with code ${code}`)
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

async function onAppReady () {
  await startApiNodeInstance()
  await createWindow()
}

app.on('ready', onAppReady)

app.on('window-all-closed', () => {
  stopApiNodeInstance()
  app.quit()
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
