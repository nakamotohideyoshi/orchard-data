const path = require('path')
const copyDir = require('copy-dir')
const {execSync} = require('child_process')

const analysisLibDirPath = path.join(__dirname, '..', '..', 'analysis-lib')

/**
 * Function called after creating the electron app unpacked directory.
 * @param {{outDir: string, appOutDir: string, electronPlatformName: string}} context
 * @return {Promise|null}
 */
let afterPack = function (context) {
  console.log(`  • building analysis-lib for ${context.electronPlatformName}`)
  execSync('npm install', {cwd: analysisLibDirPath})
  let destinationPath = ''

  switch (context.electronPlatformName) {
    case 'linux':
      execSync('npm run build:linux', {cwd: analysisLibDirPath})
      execSync('npm run build:linux-sqlite3', {cwd: analysisLibDirPath})
      destinationPath = path.join(context.outDir, 'musical-turk');
      console.log(`  • copying analysis-lib to ${destinationPath}`)
      copyDir.sync(path.join('..', 'analysis-lib', 'build', 'linux'), destinationPath)
      execSync('chmod +x analysis-lib', {cwd: destinationPath})
      break
    case 'mac':
    case 'macos':
    case 'darwin':
      execSync('npm run build:mac', {cwd: analysisLibDirPath})
      execSync('npm run build:mac-sqlite3', {cwd: analysisLibDirPath})
      destinationPath = path.join(context.appOutDir, 'Musical Turk.app', 'Contents');
      console.log(`  • copying analysis-lib to ${destinationPath}`)
      copyDir.sync(path.join('..', 'analysis-lib', 'build', 'mac'), destinationPath)
      execSync('chmod +x analysis-lib', {cwd: destinationPath})
      break
    case 'windows':
    case 'win':
    case 'win32':
      execSync('npm run build:windows', {cwd: analysisLibDirPath})
      execSync('npm run build:windows-sqlite3', {cwd: analysisLibDirPath})
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync(path.join('..', 'analysis-lib', 'build', 'windows'), context.appOutDir)
      break
  }
}

module.exports = afterPack
