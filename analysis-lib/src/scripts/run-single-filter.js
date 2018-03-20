'use strict'

module.exports = async function (datasetId, filter) {
  const Promise = require('bluebird')

  // Tools and constants
  const ReportToolModule = require('./report-tool')
  const DATABASE = require('./constants').DATABASE

  // Filters modules
  const path = require('path')
  const filters = require('require-all')(path.join(__dirname, '..', 'filters'))
  const filtersMeta = require('../filters/filters-meta')

  // DB modules
  const dbInfo = require('../db-scripts/db-info')
  const DbInterfaceModule = require('../db-scripts/db-interface')

  // Initializes report for given tsv file
  const report = new ReportToolModule()
  report.init(datasetId)

  // Initializes DB interface
  const dbInterface = new DbInterfaceModule()
  dbInterface.init()

  // Main table
  const orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']

  // Loads dataset
  const dataset = await dbInterface.fetchTsvDataset(datasetId)
  const noOfRows = dataset.length

  if (noOfRows === 0) { throw new Error(`*** dataset_id ${datasetId} does not exist on table ${orchardTable.name} ***`) }

  // stashes no of rows
  report.saveNoOfRows(noOfRows)

  try {
    await new Promise(async (resolve, reject) => {
      try {
        console.log(`Running: ${filter}`)
        report.addFilter(filter)

        if (filtersMeta[filter]['basis'] === 'row') {
          for (let idx in dataset) {
            if (dataset.hasOwnProperty(idx)) {
              idx = parseInt(idx)
              const row = dataset[idx]

              const occurrence = await filters[filter](row, idx + 1)
              if (occurrence) {
                report.addOccurrence(filter, occurrence)
              }
            }
          }
        } else if (filtersMeta[filter]['basis'] === 'dataset') {
          const occurrences = await filters[filter](dataset, report)
          occurrences.forEach(occurrence => report.addOccurrence(filter, occurrence))
        }

        resolve()
      } catch (err) { reject(err) }
    })
  } catch (err) { throw err }

  return report
}
