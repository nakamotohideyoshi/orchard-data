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
      let parsedReport = parseReport(report)
      let EBRReport = reportUtils.errorByError(parsedReport, category)
      console.log(reportUtils.errorByErrorToTsv(EBRReport))
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

            let parsedReport = parseReport(FBFReport)
            let EBEReport = reportUtils.errorByError(parsedReport, category)
            resolve(reportUtils.errorByErrorToTsv(EBEReport))
          } catch (err) { reject(err) }
        })
      })
      .then(result => console.log(result))
  }
} catch (err) { throw (err) }
