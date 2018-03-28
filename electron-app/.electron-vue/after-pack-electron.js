const copyDir = require('copy-dir')
const {spawnSync, execSync} = require('child_process')

/**
 * Function called after creating the electron app unpacked directory.
 * @param {{outDir: string, appOutDir: string, electronPlatformName: string}} context
 * @return {Promise|null}
 */
let afterPack = function (context) {
  let analysisLibRelativePath = require('path').join('..', 'analysis-lib')

  console.log(`  • building analysis-lib for ${context.electronPlatformName}`)
  spawnSync('npm', ['install'], {cwd: analysisLibRelativePath})

  switch (context.electronPlatformName) {
    case 'linux':
      spawnSync('npm', ['run', 'build:linux'], {cwd: analysisLibRelativePath})
      spawnSync('npm', ['run', 'build:linux-sqlite3'], {cwd: analysisLibRelativePath})
      console.log(`  • copying analysis-lib to ${context.outDir}`)
      copyDir.sync(require('path').join('..', 'analysis-lib', 'build', 'linux'), context.outDir)
      spawnSync('chmod', ['+x', 'analysis-lib'], {cwd: context.outDir})
      break
    case 'mac':
    case 'macos':
    case 'darwin':
      spawnSync('npm', ['run', 'build:mac'], {cwd: analysisLibRelativePath})
      spawnSync('npm', ['run', 'build:mac-sqlite3'], {cwd: analysisLibRelativePath})
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync(require('path').join('..', 'analysis-lib', 'build', 'mac'), context.appOutDir)
      spawnSync('chmod', ['+x', 'analysis-lib'], {cwd: context.appOutDir})
      break
    case 'windows':
    case 'win':
    case 'win32':
      execSync('npm run build:windows', {cwd: analysisLibRelativePath})
      execSync('npm run build:windows-sqlite3', {cwd: analysisLibRelativePath})
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync(require('path').join('..', 'analysis-lib', 'build', 'windows'), context.appOutDir)
      break
  }
}

module.exports = afterPack
