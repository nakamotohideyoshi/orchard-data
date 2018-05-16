module.exports = function () {
  // load modules
  let fs = require('fs')
  let csvParser = require('csv-parse')
  let csvWriter = require('csv-write-stream')
  let Promise = require('bluebird')
  let XLSX = require('xlsx')

  this.readTsv = function (inputFile) {
    console.log("readTsv 1",inputFile)
    return new Promise((resolve, reject) => {
      console.log("readTsv 2")

      if( ! fs.existsSync(inputFile)){
        console.log("readTsv 3")
        reject(new Error('File does not exist'))
        return
      }

      console.log("readTsv 4")
      let arr = inputFile.split(".")
      console.log("readTsv 5",arr)
      let ext = arr[arr.length-1].toLowerCase()
      console.log("readTsv 6",ext)
      switch(ext){

        case "xls":
        case "xlsx":
        console.log("readTsv 7")
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
        break

        case "tsv":
        console.log("readTsv 8")
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
        console.log("readTsv 9")
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
