'use strict';

module.exports = async function(datasetId) {

  const Promise = require('bluebird')

  // tools and constants
  const reportToolModule = require('./report-tool');
  const DATABASE = require('./constants').DATABASE;

  // Filters module
  const filters = require('../filters/filters-module');
  const filtersMeta = require('../filters/filters-meta');

  // DB modules
  const sqlite = require('sqlite');
  const dbInfo = require('../db-scripts/db-info');
  const dbInterfaceModule = require('../db-scripts/db-interface');

  // Initializes report for given tsv file
  const report = new reportToolModule();
  report.init(datasetId);

  // Initializes DB interface
  const dbInterface = new dbInterfaceModule();
  dbInterface.init();

  // Main table
  const orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];

  // Loads dataset
  const dataset = await dbInterface.fetchTsvDataset(datasetId);
  const noOfRows = dataset.length;

  if(noOfRows === 0) { throw new Error(`*** dataset_id ${datasetId} does not exist on table ${orchardTable.name} ***`); }

  // stashes no of rows
  report.saveNoOfRows(noOfRows);

  // Filters that can be run on a row basis
  const rowFilters = Object.keys(filtersMeta)
    .filter(filterId => filtersMeta[filterId]['basis'] === 'row');

  // Filters that must be run against an entire dataset
  const datasetFilters = Object.keys(filtersMeta)
    .filter(filterId => filtersMeta[filterId]['basis'] === 'dataset');

  // Waits for all filters to finish
  await new Promise((resolve, reject) => {

    for(let filter of rowFilters) {

      console.log(`Running: ${filter}`)
      report.addFilter(filter);

      for(let idx in dataset) {

        idx = parseInt(idx);
        const row = dataset[idx];

        filters[filter](row, idx + 1, report);
        console.log(report['filters']['filter1'])

      };

    }

    for(let filter of datasetFilters) {

      report.addFilter(filter);
      filters[filter](dataset, report);

    };

    resolve();

  });

  console.log(report['filters']['filter1'])

  return report;

}
