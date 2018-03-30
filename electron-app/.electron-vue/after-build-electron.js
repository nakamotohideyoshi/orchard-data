const os = require('os')
const targz = require('targz')
const path = require('path')
const cpy = require('cpy')

const buildDirPath = path.join(__dirname, '..', 'build')

if (os.platform() === 'linux') {
  cpy(path.join(buildDirPath, '*.AppImage'), path.join(buildDirPath, 'musical-turk')).then(() => {
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
