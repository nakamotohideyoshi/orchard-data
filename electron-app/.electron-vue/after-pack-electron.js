const path = require('path')
const copyDir = require('copy-dir')
const {execSync} = require('child_process')

/**
 * Function called after creating the electron app unpacked directory.
 * @param {{outDir: string, appOutDir: string, electronPlatformName: string}} context
 * @return {Promise|null}
 */
let afterPack = function (context) {
  let analysisLibRelativePath = require('path').join('..', 'analysis-lib')

  console.log(`  • building analysis-lib for ${context.electronPlatformName}`)
  execSync('npm install', {cwd: analysisLibRelativePath})

  switch (context.electronPlatformName) {
    case 'linux':
      execSync('npm run build:linux', {cwd: analysisLibRelativePath})
      execSync('npm run build:linux-sqlite3', {cwd: analysisLibRelativePath})
      console.log(`  • copying analysis-lib to ${context.outDir}`)
      copyDir.sync(path.join('..', 'analysis-lib', 'build', 'linux'), context.outDir)
      execSync('chmod +x analysis-lib', {cwd: context.outDir})
      break
    case 'mac':
    case 'macos':
    case 'darwin':
      execSync('npm run build:mac', {cwd: analysisLibRelativePath})
      execSync('npm run build:mac-sqlite3', {cwd: analysisLibRelativePath})
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync(path.join('..', 'analysis-lib', 'build', 'mac'), context.appOutDir)
      execSync('chmod +x analysis-lib', {cwd: context.appOutDir})
      break
    case 'windows':
    case 'win':
    case 'win32':
      execSync('npm run build:windows', {cwd: analysisLibRelativePath})
      execSync('npm run build:windows-sqlite3', {cwd: analysisLibRelativePath})
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync(path.join('..', 'analysis-lib', 'build', 'windows'), context.appOutDir)
      break
  }
}

module.exports = afterPack
