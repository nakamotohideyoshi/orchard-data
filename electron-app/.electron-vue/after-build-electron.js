const os = require('os')
const targz = require('targz')
const path = require('path')
const cpy = require('cpy')
const fs = require('fs')

const buildDirPath = path.join(__dirname, '..', 'build')
const linuxPackagedFilesDir = path.join(buildDirPath, 'musical-turk')

if (os.platform() === 'linux' && fs.existsSync(linuxPackagedFilesDir)) {
  cpy(path.join(buildDirPath, '*.AppImage'), linuxPackagedFilesDir).then(() => {
    const compressedFilePath = path.join(buildDirPath, 'musical-turk.tar.gz')
    targz.compress({
      src: path.join(buildDirPath, 'musical-turk'),
      dest: compressedFilePath
    }, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('  • compressing Linux binaries to ' + compressedFilePath)
      }
    })
  })
}
