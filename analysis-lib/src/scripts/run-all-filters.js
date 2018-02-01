module.exports = function(datasetId) {

  let filters = require('../filters/filters-module');
  let reportToolModule = require('./report-tool');
  let Promise = require('bluebird')
  let DATABASE = require('./constants').DATABASE;

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

  let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];

  // total no of rows the filter is going to be applied
  let noOfRows = 0;

  let dbPromise = dbInterface.fetchTsvDataset(datasetId)
    .then(rows => {

      noOfRows = rows.length;

      Object.keys(filters).forEach(filter => {

        // For each row run filter
        rows.forEach((row, idx) => {

          report.addFilter(filter);
          filters[filter](row, idx, report);

        });

      });

    })
    .then(() => {

        if(noOfRows === 0) {

          console.log(`*** dataset_id ${datasetId} does not
                      exist on table ${orchardTable.name} ***`);

        }

        else {

          // Stashes total number of rows for analysis
          report.saveNoOfRows(noOfRows);
          return report;

        }

      });

  return dbPromise;

}
