const copyDir = require('copy-dir');
const { spawnSync } = require('child_process');
/**
 * Function called after creating the electron app unpacked directory.
 * @param {{outDir: string, appOutDir: string, electronPlatformName: string}} context
 * @return {Promise|null}
 */
let afterPack = function (context) {
  console.log(`  • building analysis-lib`)
  spawnSync('npm', ['install'], { cwd: '../analysis-lib' });

  switch (context.electronPlatformName) {
    case 'linux':
      spawnSync('npm', ['run', 'build:linux'], { cwd: '../analysis-lib' });
      spawnSync('npm', ['run', 'build:linux-sqlite3'], { cwd: '../analysis-lib' });
      console.log(`  • copying analysis-lib to ${context.outDir}`)
      copyDir.sync('../analysis-lib/build/linux', context.outDir);
      spawnSync('chmod', ['+x', 'analysis-lib'], { cwd: context.outDir });
      break;
    case 'mac':
      spawnSync('npm', ['run', 'build:mac'], { cwd: '../analysis-lib' });
      spawnSync('npm', ['run', 'build:mac-sqlite3'], { cwd: '../analysis-lib' });
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync('../analysis-lib/build/mac', context.appOutDir);
      spawnSync('chmod', ['+x', 'analysis-lib'], { cwd: context.appOutDir });
      break;
    case 'win':
      spawnSync('npm', ['run', 'build:windows'], { cwd: '../analysis-lib' });
      spawnSync('npm', ['run', 'build:windows-sqlite3'], { cwd: '../analysis-lib' });
      console.log(`  • copying analysis-lib to ${context.appOutDir}`)
      copyDir.sync('../analysis-lib/build/windows', context.appOutDir);
      break;
  }
}

module.exports = afterPack
