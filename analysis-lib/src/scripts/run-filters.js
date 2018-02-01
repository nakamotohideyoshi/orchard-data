module.exports = function(filterId, datasetId) {

  let filters = require('../filters/filters-module');
  let reportToolModule = require('./report-tool');
  let Promise = require('bluebird')
  let DATABASE = require('./constants').DATABASE;

  // DB modules
  let sqlite = require('sqlite');
  let dbInfo = require('../db-scripts/db-info');
  let dbInterfaceModule = require('../db-scripts/db-interface');

  // Filter string
  let filterRegex = /(filter)[0-9]+/i;
  let filterName = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

  // checks if chosen filter exists
  let found = false;

  Object.keys(filters).forEach(filter => {
    if(filter === filterName) { found = true; }
  });

  if(!found && !runAll) {
    throw(`\n***** ${filterName} does not exists. Try a different <filter_id> *****\n`);
  }

  // Initializes report for given tsv file
  let report = new reportToolModule();
  report.init(datasetId);

  // Initializes DB interface
  let dbInterface = new dbInterfaceModule();
  dbInterface.init();

  // total no of rows the filter is going to be applied
  let noOfRows = 0;

  let dbPromise = dbInterface.fetchTsvDataset(datasetId)
    .then(rows => {

      noOfRows = rows.length;

      // For each row run filter
      rows.forEach((row, idx) => {

        report.addFilter(filterName);
        filters[filterName](row, idx, report);

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

          // Calcs field by field report
          report.calcFieldByFieldReport(filterId);

        }

      });

}
