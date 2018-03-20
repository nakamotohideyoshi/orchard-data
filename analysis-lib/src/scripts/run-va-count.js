'use strict'

module.exports = async function (datasetId) {
  const Promise = require('bluebird')

  // tools and constants
  const DATABASE = require('./constants').DATABASE

  const variousArtistsCount = require('../va-count/variousartistscount')
  let vacount = 0
  // DB modules
  const dbInfo = require('../db-scripts/db-info')
  const DbInterfaceModule = require('../db-scripts/db-interface')

  // Initializes DB interface
  const dbInterface = new DbInterfaceModule()
  dbInterface.init()

  // Main table
  const orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']

  // Loads dataset
  const dataset = await dbInterface.fetchTsvDataset(datasetId)
  const noOfRows = dataset.length

  if (noOfRows === 0) { throw new Error(`*** dataset_id ${datasetId} does not exist on table ${orchardTable.name} ***`) }

  try {
    // Waits for all filters to finish
    vacount = await new Promise(async (resolve, reject) => {
      try {
        console.log(`Various Artists count: `)

        // calculate Various Artists Count
        const count = await variousArtistsCount(dataset)
        resolve(count)
      } catch (err) { reject(err) }
    })
  } catch (err) { throw err }

  return vacount
}
