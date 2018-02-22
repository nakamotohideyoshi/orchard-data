module.exports = function(datasetId) {

  let Promise = require('bluebird')

  // tools and constants
  let reportToolModule = require('./report-tool');
  let DATABASE = require('./constants').DATABASE;

  // Filters module
  let filters = require('../filters/filters-module');
  let filtersMeta = require('../filters/filters-meta');

  // DB modules
  let sqlite = require('sqlite');
  let dbInfo = require('../db-scripts/db-info');
  let dbInterfaceModule = require('../db-scripts/db-interface');

  // Initializes report for given tsv file
  let report = new reportToolModule();
  report.init(datasetId);

  // Initializes DB interface
  let dbInterface = new dbInterfaceModule();
  dbInterface.init();

  // Main table
  let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];

  // total no of rows the filter is going to be applied
  let noOfRows = 0;

  let dbPromise = dbInterface.fetchTsvDataset(datasetId)
    .then(dataset => {

      return new Promise((resolve, reject) => {

        try {

          noOfRows = dataset.length;

          let rowFilters = Object.keys(filtersMeta)
            .filter(filterId => filtersMeta[filterId]['basis'] === 'row');

          let datasetFilters = Object.keys(filtersMeta)
            .filter(filterId => filtersMeta[filterId]['basis'] === 'dataset');

          rowFilters.forEach(filter => {

            // For each row run filter
            dataset.forEach((row, idx) => {

              report.addFilter(filter);
              filters[filter](row, idx + 1, report);

            });

          });

          datasetFilters.forEach(filter => {

            report.addFilter(filter);
            filters[filter](dataset, report);

          });

          resolve();

        }

        catch(err) { reject(err); }

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
