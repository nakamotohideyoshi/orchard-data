let csvParser = require('csv-parse/lib/sync')
let argv = require('minimist')(process.argv.splice(2))

let IOModule = require('./IO-module')
let reportUtils = require('./report-utils')

let input = argv['input']
let category = argv['category']

let parseReport = function (report) {
  let parsedReport = []

  report.forEach(occurrence => {
    let data = {
      'test_data_row_id': occurrence['dataRowId'],
      'criteria_id': occurrence['criteriaId']
    }

    parsedReport.push(data)
  })

  return parsedReport
}

try {
  if (!input) {
    let reportString = argv['_'][0]

    let parserOpts = {
      delimiter: '\t',
      columns: true,
      quote: '`'
    }

    let report = csvParser(reportString, parserOpts)

    if (report.length !== 0) {
      let datasetSize = report[0]['datasetSize'] || 0
      let parsedReport = []
      report.forEach(occurrence => {
        let data = {
          'test_data_row_id': occurrence['dataRowId'],
          'criteria_id': occurrence['criteriaId']
        }

        parsedReport.push(data)
      })
      let RBRReport = reportUtils.rowByRow(parsedReport, datasetSize, category)
      console.log(reportUtils.rowByRowToTsv(RBRReport))
    } else {
      console.log(`Empty Report. Exiting...`)
    }
  } else { // Opens File
    let IO = new IOModule()

    IO.readTsv(input)
      .then(FBFReport => {
        return new Promise((resolve, reject) => {
          try {
            if (FBFReport.length === 0) {
              resolve(`Empty Report. Exiting...`)
            }

            let datasetSize = FBFReport[0]['datasetSize']
            let parsedReport = parseReport(FBFReport)
            let RBRReport = reportUtils.rowByRow(parsedReport, datasetSize, category)
            resolve(reportUtils.rowByRowToTsv(RBRReport))
          } catch (err) {
            reject(err)
          }
        })
      })
      .then(result => console.log(result))
  }
} catch (err) {
  throw (err)
}
