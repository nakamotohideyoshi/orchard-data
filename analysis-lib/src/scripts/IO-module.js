module.exports = function () {
  // load modules
  let fs = require('fs')
  let csvParser = require('csv-parse')
  let csvWriter = require('csv-write-stream')
  let Promise = require('bluebird')
  let XLSX = require('xlsx')

  this.readTsv = function (inputFile) {
    return new Promise((resolve, reject) => {
      // Checks if file exist
      if (fs.existsSync(inputFile)) {
        if (inputFile.toLowerCase().indexOf('.xls') !== -1) {
          let workbook = XLSX.readFile(inputFile)
          let firstSheetName = workbook.SheetNames[0]
          let worksheet = workbook.Sheets[firstSheetName]
          let xlsConvertedToTsv = XLSX.utils.sheet_to_csv(worksheet, {FS: '\t'})
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
        } else {
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
        }
      } else {
        reject(new Error('File does not exist'))
      }
    })
  }

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
