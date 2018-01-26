module.exports = function(filterId, dbName, datasetId) {

  // Run all filters
  let filters = require('../filters/filters-module');
  let reportToolModule = require('./report-tool');
  let Promise = require('bluebird')

  // DB modules
  let dbInfo = require('../db-scripts/db-info');
  let dbInterface = require('../db-scripts/db-interface-module');
  let sqlite = require('sqlite');

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

  // Initialize DB Interface
  let dbPath = dbInfo[dbName]['path'].concat(dbInfo[dbName]['name']).join('/');
  let orchardTable = dbInfo[dbName]['tables']['orchard_dataset_contents'];

  // Initializes report for given tsv file
  let report = new reportToolModule();
  report.init(datasetId);

  try {

    let dbPromise = Promise.resolve()
    .then(() => sqlite.open(dbPath, { Promise }))
    .then(db => {

      let noOfRows;

      // Loads file
      //db.all(`SELECT * FROM ${orchardTable.name} WHERE dataset_id = ${datasetId}`)
      db.all(`SELECT * FROM ${orchardTable.name} WHERE dataset_id = '${datasetId}'`)
      .then((rows) => {

        // Retrieves total number of rows for this dataset
        noOfRows = rows.length;

        rows.forEach((row, idx) => {

          // Runs all filters
          if(runAll) {

            Object.keys(filters).forEach(filter => {

              report.addFilter(filter);
              filters[filter](row, idx, report);

            });

          }

          // Run single filter
          else {

            report.addFilter(filterName);
            filters[filterName](row, idx, report);

          }

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

    });

  }

  catch (err) {

    next(err);

  }

}
