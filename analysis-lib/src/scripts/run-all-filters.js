'use strict';

module.exports = function(datasetId) {

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

  // total no of rows the filter is going to be applied
  let noOfRows = 0;

  const dbPromise = dbInterface.fetchTsvDataset(datasetId)
    .then(dataset => {

      return new Promise((resolve, reject) => {

        try {

          noOfRows = dataset.length;

          const rowFilters = Object.keys(filtersMeta)
            .filter(filterId => filtersMeta[filterId]['basis'] === 'row');

          const datasetFilters = Object.keys(filtersMeta)
            .filter(filterId => filtersMeta[filterId]['basis'] === 'dataset');

          rowFilters.forEach(filter => {

            // For each row run filter
            dataset.forEach((row, idx) => {

              report.addFilter(filter);
              const occurrence = filters[filter](row, idx + 1, report);
              if(occurrence){ report.addOccurrence(filter, occurrence); }

            });

          });

          datasetFilters.forEach(filter => {

            report.addFilter(filter);
            const occurrences = filters[filter](dataset);

            occurrences.forEach(occurrence => {
              if(occurrence){ report.addOccurrence(filter, occurrence); }
            });

          });

          resolve();

        }

        catch(err) { console.log(err); reject(err); }

      });

    })
    .then(() => {

      return new Promise((resolve, reject) => {

        if(noOfRows === 0) {

          reject(`*** dataset_id ${datasetId} does not exist on table ${orchardTable.name} ***`);

        }

        else {

          // Stashes total number of rows for analysis
          report.saveNoOfRows(noOfRows);
          resolve(report);

        }

      });

    });

  return dbPromise;

}
