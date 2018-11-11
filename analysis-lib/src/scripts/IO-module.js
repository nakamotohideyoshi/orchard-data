module.exports = function () {
  // load modules
  let fs = require('fs')
  let csvParser = require('csv-parse')
  let csvWriter = require('csv-write-stream')
  let Promise = require('bluebird')
  let XLSX = require('xlsx')

  this.readTsv = function (inputFile) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(inputFile)) {
        reject(new Error('File does not exist'))
        return
      }

      let arr = inputFile.split('.')
      let ext = arr[arr.length - 1].toLowerCase()
      switch (ext) {
        case 'xls':
        case 'xlsx':
          let workbook = XLSX.readFile(inputFile)
          let firstSheetName = workbook.SheetNames[0]
          let worksheet = workbook.Sheets[firstSheetName]
          let xlsConvertedToTsv = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t' })
          csvParser(xlsConvertedToTsv, {
            delimiter: '\t',
            columns: true,
            quote: '`',
            relax: true
          }, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
          break

        case 'tsv':
          // Creates stream of data
          let stream = fs.createReadStream(inputFile, { encoding: 'utf-8' })
          let parser = csvParser({
            delimiter: '\t',
            columns: true,
            quote: '`',
            relax: true
          }, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
          stream.pipe(parser)
          break

        default:
          reject(new Error('File type not supported'))
      } // end switch
    }) // end Promise
  } // end readTsv

  this.writeTsv = function (outPath, data, headers) {
    // Creates stream of data
    let writer = csvWriter({
      'headers': headers,
      'separator': '\t'
    })

    if (data.length === 0) { return Promise.resolve([]) }

    let stream = fs.createWriteStream(outPath)
    writer.pipe(stream)

    return new Promise((resolve, reject) => {
      try {
        data.forEach(element => writer.write(element))
        writer.end()
        resolve('SUCESS')
      } catch (err) {
        reject(err)
      }
    })
  }
}
