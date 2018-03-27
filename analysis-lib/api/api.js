// Packages
let express = require('express')
let router = express.Router()

let analysisLibModule = require('../analysis-lib-module')

console.log('\n***** Initializing Analysis Lib Module API *****\n')

// DB interface
let dbInterface = new analysisLibModule.DbInterface()
dbInterface.init()

// reportUtils
let reportUtils = analysisLibModule.reportUtils

// Fetch a TSV dataset
router.get('/dataset/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  res.type('text/tab-separated-values')

  dbInterface.fetchTsvDataset(datasetId)
    .then(rows => res.status(200).send(rows))
})

// Sava TSV and run test cases
router.post('/dataset', async (req, res) => {
  const data = req.body
  let currentDatasetId

  try {
    console.log('\n***** Saving Dataset Metadata *****')

    const { datasetId } = await dbInterface.saveDatasetMeta(data)
    currentDatasetId = datasetId

    console.log('***** Done *****\n')
    console.log('***** Saving Tsv File *****')

    await dbInterface.saveTsvIntoDB(data.source, datasetId)

    console.log('***** Done *****\n')
    console.log('***** Running all Filters *****')

    const report = await analysisLibModule.runAllFilters(datasetId)

    console.log('***** Done *****\n')
    console.log('***** Various Artists count *****')

    const vaCount = await analysisLibModule.runVACount(datasetId)

    console.log('***** Done *****\n')
    console.log('***** Calculating Field by Field Report *****')

    await report.calcFieldByFieldReportAll()

    console.log('***** Done *****\n')
    console.log('***** Saving Field By Field Report *****')

    await dbInterface.saveFieldByFieldReport(report.FBFReport)

    console.log('***** Saved *****\n')
    console.log('***** Calculating Batch Results Report *****')

    await report.calcBatchResultsReport(vaCount)

    console.log('***** Done *****\n')
    console.log('***** Saving Batch Results Report *****')

    await dbInterface.saveBatchResultsReport(report.BRReport)

    console.log('***** Done *****\n')
    console.log('***** Updating Dataset Status "Success" *****\n')

    await dbInterface.updateDatasetStatus(datasetId, 1)

    console.log('***** Done *****\n')
    console.log('***** FINISHED *****\n')

    res.status(201).json({ status: 'OK', datasetId: datasetId })
  } catch (err) {
    console.log('***** Updating Dataset Status "Failed" *****\n')

    await dbInterface.updateDatasetStatus(currentDatasetId, 2)
    console.log('***** Done *****\n')

    res.status(500).json({ title: err.name, detail: err.message, datasetId: currentDatasetId })
  }
})

// Sava TSV and run test cases
router.get('/run-filter/:filterId/:datasetId', async (req, res) => {
  const datasetId = req.params.datasetId
  const filterId = req.params.filterId

  try {
    console.log('\n***** Getting Dataset Size *****')
    const datasetSize = await dbInterface.getDatasetSize(datasetId)

    if (datasetSize === 0) {
      res.status(400).send(`Empty report for datasetId ${datasetId}.`)
      return
    }

    console.log(`\n***** Running ${filterId} on dataset ${datasetId} *****`)
    const report = await analysisLibModule.runSingleFilter(datasetId, filterId)

    console.log(`\n***** Calculating Field by Field Report *****`)
    await report.calcFieldByFieldReportAll()

    res.send(reportUtils.fieldByFieldToTsv(report.FBFReport, datasetSize))
  } catch (err) { res.status(500).send(err) }
})

// Fetch all reports
router.get('/field-by-field-reports', (req, res) => {
  dbInterface.fetchAllFieldByFieldReports()
    .then(report => {
      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.parseFieldByFieldReport(report)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err))
})

// Returns report as a TSV
router.get('/field-by-field/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  let datasetSize = 0
  res.type('text/tab-separated-values')

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {
      if (report.length === 0) {
        res.send(`Empty report for datasetId ${datasetId}.`)
        return
      }

      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.fieldByFieldToTsv(report, datasetSize)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
})

// Fetch single report from DB
router.get('/field-by-field/:datasetId', (req, res) => {
  let datasetId = req.params.datasetId
  let datasetSize = 0

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {
      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.parseFieldByFieldReport(report, datasetSize)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Returns report as a TSV
router.get('/field-by-field/:category/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  let category = req.params.category
  let datasetSize = 0
  res.type('text/tab-separated-values')

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
    .then(report => {
      if (report.length === 0) {
        res.send(`Empty report for datasetId ${datasetId}.`)
        return
      }

      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.fieldByFieldToTsv(report, datasetSize)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).json({ title: err.name, detail: err.message }))
})

// Fetch single report from DB
router.get('/field-by-field/:category/:datasetId', (req, res) => {
  let datasetId = req.params.datasetId
  let category = req.params.category
  let datasetSize = 0

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
    .then(report => {
      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.parseFieldByFieldReport(report, datasetSize)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Row by Row Aggregation TSV
router.get('/row-by-row/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  let datasetSize = 0
  res.type('text/tab-separated-values')

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {
      return new Promise((resolve, reject) => {
        try {
          let RBRReport = reportUtils.rowByRow(report, datasetSize)
          resolve(reportUtils.rowByRowToTsv(RBRReport))
        } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Row by Row Aggregation Report
router.get('/row-by-row/:datasetId', (req, res) => {
  let datasetId = req.params.datasetId
  let datasetSize = 0

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {
      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.rowByRow(report, datasetSize)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Row by Row Aggregation TSV
router.get('/row-by-row/:category/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  let category = req.params.category
  let datasetSize = 0
  res.type('text/tab-separated-values')

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
    .then(report => {
      return new Promise((resolve, reject) => {
        try {
          let RBRReport = reportUtils.rowByRow(report, datasetSize)
          resolve(reportUtils.rowByRowToTsv(RBRReport))
        } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Row by Row Aggregation Report
router.get('/row-by-row/:category/:datasetId', (req, res) => {
  let datasetId = req.params.datasetId
  let category = req.params.category
  let datasetSize = 0

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result
      return Promise.resolve(datasetSize)
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
    .then(report => {
      return new Promise((resolve, reject) => {
        try { resolve(reportUtils.rowByRow(report, datasetSize)) } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Error by Error Aggregation TSV
// TODO: Merge error-by-error JSON and TSV endpoints
router.get('/error-by-error/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  res.type('text/tab-separated-values')

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {
      return new Promise((resolve, reject) => {
        try {
          if (report.length === 0) {
            resolve(`Empty report for datasetId ${datasetId}.`)
          }

          // Row by Row Aggregation
          let EBEReport = reportUtils.errorByError(report)
          resolve(reportUtils.errorByErrorToTsv(EBEReport))
        } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Error by Error Aggregation
router.get('/error-by-error/:datasetId', (req, res) => {
  let datasetId = req.params.datasetId

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {
      if (report.length === 0) {
        throw new Error(`Empty report for datasetId ${datasetId}.`)
      }

      // Row by Row Aggregation
      let EBEReport = reportUtils.errorByError(report)
      res.status(200).json(EBEReport)
    })
    .catch((e) => {
      res.status(400).json({ message: e.message })
    })
})

// Error by Error Aggregation TSV
router.get('/error-by-error/:category/:datasetId.tsv', (req, res) => {
  let datasetId = req.params.datasetId
  let category = req.params.category
  res.type('text/tab-separated-values')

  dbInterface.fetchFieldByFieldReport(datasetId, category)
    .then(report => {
      return new Promise((resolve, reject) => {
        try {
          if (report.length === 0) {
            resolve(`Empty report for datasetId ${datasetId}.`)
          }

          // Row by Row Aggregation
          let EBEReport = reportUtils.errorByError(report, category)
          resolve(reportUtils.errorByErrorToTsv(EBEReport))
        } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Error by Error Aggregation
router.get('/error-by-error/:category/:datasetId', (req, res) => {
  let datasetId = req.params.datasetId
  let category = req.params.category

  dbInterface.fetchFieldByFieldReport(datasetId, category)
    .then(report => {
      return new Promise((resolve, reject) => {
        try {
          if (report.length === 0) {
            resolve(`Empty report for datasetId ${datasetId}.`)
          }

          // Row by Row Aggregation
          let EBEReport = reportUtils.errorByError(report, category)
          resolve(EBEReport)
        } catch (err) { reject(err) }
      })
    })
    .then(result => res.send(result))
})

// Fetch single report summary
router.get('/report-summary/:datasetId', async (req, res) => {
  let datasetId = req.params.datasetId
  try {
    const report = await dbInterface.fetchBatchResultsReport(datasetId)

    let resObj = {
      'rowid': report[0].rowid,
      'dataset_id': report[0].dataset_id,
      'no_of_rows': report[0].no_of_rows,
      'category': {
        'risk': {
          'no_of_errors': report[0].no_of_risk_errors,
          'error_percent': report[0].error_risk_percent,
          'error_score': report[0].error_risk_score,
          'vacount_percent': report[0].vacount_percent
        },
        'itunes': {
          'no_of_errors': report[0].no_of_itunes_errors,
          'error_percent': report[0].error_itunes_percent,
          'error_score': report[0].error_itunes_score
        }
      }
    }

    res.status(200).json(resObj)
  } catch (err) { res.status(400).json({ 'title': err.name, 'detail': err.message }) }
})

// Fetch all report summaries
router.get('/report-summaries', (req, res) => {
  dbInterface.fetchAllBatchResultsReports()
    .then(report => res.send(report))
})

// Fetch params and status for a dataset
router.get('/dataset-meta/:rowId', (req, res) => {
  let rowId = req.params.rowId

  dbInterface.fetchDatasetMetaRow(rowId)
    .then(row => res.send(row))
})

// Delete a dataset based on its rowid
router.delete('/dataset-meta/:rowId', (req, res) => {
  let rowId = req.params.rowId

  dbInterface.deleteDatasetMetaRow(rowId)
    .then(row => res.send(row))
})

// Fetch params for all datasets
router.get('/dataset-meta-all', (req, res) => {
  dbInterface.fetchDatasetMeta()
    .then(rows => res.send(rows))
})

// Return filters meta data
router.get('/config', (req, res) => {
  const meta = analysisLibModule.filtersMeta
  const datasetColumns = dbInterface.datasetColumnsDictionary()

  res.status(200).json({ meta, datasetColumns })
})

// Export modules
module.exports = router
