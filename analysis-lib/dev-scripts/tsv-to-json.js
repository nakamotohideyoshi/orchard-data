let analysisLibModule = require('../analysis-lib-module')
let argv = require('minimist')(process.argv.splice(2))
let fs = require('fs')

let IO = new analysisLibModule.IO()

let DATABASE = analysisLibModule.constants.DATABASE
let dbInfo = analysisLibModule.dbInfo[DATABASE].tables
let table = 'orchard_dataset_contents'

let inputDir = ['.', 'data-tests', 'input-files']
let filter = argv['filter']
let inputFile = argv['input'] || 'test.tsv'

let inputPath = inputDir.concat(filter).concat(inputFile).join('/')

if (!argv['filter']) {
  throw Error('\n ***** No filter specified. *****\n')
}
if (!argv['input']) {
  console.log('\n ***** No file specified. Using test.tsv *****\n')
}

let parsedFile = []
let fieldsDict = dbInfo[table].columns_dict

IO.readTsv(inputPath).then(file => {
  file.forEach(row => {
    let parsedRow = {}

    Object.keys(row).forEach(key => {
      if (key in fieldsDict) {
        parsedRow[fieldsDict[key]] = row[key]
      }
    })

    parsedFile.push(parsedRow)
  })
}).catch(err => {
  console.log(inputPath)
  console.log(err)
}).finally(() => {
  fs.writeFileSync(`mocks/raw_${filter}.json`, JSON.stringify(parsedFile), 'utf8')
})
