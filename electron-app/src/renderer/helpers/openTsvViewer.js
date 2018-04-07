import { remote } from 'electron'
import path from 'path'

const { BrowserWindow } = remote

/**
 * Opens the TSV for a particular batch in a new window.
 *
 * @param {String,Number} batchId The batch ID you want to open
 * @param {String, Number} rowId The row ID to be highlighted (optional)
 * @returns {Electron.Remote.BrowserWindow} Reference to the new Electron window
 */
export default function (batchId, rowId) {
  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#tsv/${batchId}/${rowId}`
    : `file://${__dirname}/index.html#tsv/${batchId}/${rowId}`

  const newWindow = new BrowserWindow({
    title: `Dataset TSV (${batchId})`,
    show: false,
    icon: path.join(__dirname, '..', '..', '..', 'build', 'icons', '64x64.png')
  })

  newWindow.loadURL(winURL)
  newWindow.show()

  return newWindow
}
