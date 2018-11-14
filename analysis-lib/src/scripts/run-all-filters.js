'use strict'

module.exports = async function (datasetId) {
  const Promise = require('bluebird')

  // tools and constants
  const ReportToolModule = require('./report-tool')
  const DATABASE = require('./constants').DATABASE

  // Filters module
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
  const metadata = await dbInterface.fetchDatasetMetaRow(datasetId)
  const noOfRows = dataset.length

  if (noOfRows === 0) { throw new Error(`*** dataset_id ${datasetId} does not exist on table ${orchardTable.name} ***`) }

  // stashes no of rows
  report.saveNoOfRows(noOfRows)

  // Filters that can be run on a row basis
  const rowFilters = Object.keys(filtersMeta)
    .filter(filterId => filtersMeta[filterId]['basis'] === 'row')

  // Filters that must be run against an entire dataset
  const datasetFilters = Object.keys(filtersMeta)
    .filter(filterId => filtersMeta[filterId]['basis'] === 'dataset')

  try {
    // Waits for all filters to finish
    await new Promise(async (resolve, reject) => {
      try {
        for (let filter of rowFilters) {
          console.log(`Running: ${filter}`)
          report.addFilter(filter)

          for (let idx in dataset) {
            if (dataset.hasOwnProperty(idx)) {
              idx = parseInt(idx)
              const row = dataset[idx]
              const occurrence = await filters[filter](row, idx + 1, metadata)
              if (occurrence) { report.addOccurrence(filter, Object.assign(occurrence, { 'dataset_row_id': row.rowid })) }
            }
          }
        }

        for (let filter of datasetFilters) {
          console.log(`Running: ${filter}`)
          report.addFilter(filter)
          const occurrences = await filters[filter](dataset, metadata)

          occurrences.forEach(occurrence => report.addOccurrence(filter, occurrence))
        }

        resolve()
      } catch (err) { reject(err) }
    })
  } catch (err) { throw err }

  return report
}
