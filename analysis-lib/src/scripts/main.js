// Run all filters
let filters = require('../filters/filters-module');
let reportToolModule = require('./report-tool');
let argv = require('minimist')(process.argv.slice(2));
let Promise = require('bluebird')

// DB modules
let dbInfo = require('../db-scripts/db-info');
let dbInterface = require('../db-scripts/db-interface-module');
let sqlite = require('sqlite');

// Filter string
let filterRegex = /(filter)[0-9]+/i;
let filterId = argv['filter'];
let filterName = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

// Run all filters if no filter was specified or does not exist
let runAll = !argv['filter'];

// checks if chosen filter exists
let found = false;

Object.keys(filters).forEach(filter => {
  if(filter === filterName) { found = true; }
});

if(!found && !runAll) {
  throw(`\n***** ${filterName} does not exists. Try a different <filter_id> *****\n`);
}

// Retrieves dataset id
let datasetId = argv['input'];

// No filter specified
if(!datasetId) {
  throw("No datasetID specified");
}

// Initialize DB Interface
let dbName = 'analysis-lib';
let dbPath = dbInfo[dbName]['path'].concat(dbInfo[dbName]['name']).join('/');
let tsvFilesTable = dbInfo[dbName]['tables']['tsv_files'].name;
// let dbInterface = new dbInterfaceModule().loadDB(dbPath);

// Initializes report for given tsv file
let report = new reportToolModule();

try {

  let db;
  let tsvTableName;
  let noOfRows = 0;

  let dbPromise = Promise.resolve()
    .then(() => sqlite.open(dbPath, { Promise }))
    .then(database => {
      // stashes this promise for further use
      db = database;
      return db;
    })
    .then(() => db.get(`SELECT table_name FROM ${tsvFilesTable} WHERE rowID = ${datasetId}`))
    .then(result => tsvTableName = result['table_name'])
    .then(() => report.init(tsvTableName))
    .then(() => {

      // Loads file
      db.all(`SELECT * FROM ${tsvTableName}`)
        .then((rows) => {

          noOfRows += 1;

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
          report.saveNoOfRows(noOfRows);

          // report.calcDatasetMetadata(1);
          // report.printFilterReport('filter1');
          report.calcFieldByFieldReport(filterId);

          // report.calcDatasetMetadataAll(1);
          // report.printReport(1);

          // report.printReport();
          // report.printFilterReport(1);

        });

    });

}

catch (err) {

  next(err);

}
// Joins full path
// inputFile = inputDir.concat(inputFile).join("/");

// Gets stream object
// let stream = loadTsv(inputFile);
// let noOfRows = 0;
//var headers = [];
// var tsvData = [];

// Run filters
// stream
//   // .on('headers', function(headersList) {
//
//   //   headers = headersList;
//
//   // })
//   .on('data', function(row) {
//
//     noOfRows += 1;
//
//     // Runs all filters
//     if(runAll) {
//
//       Object.keys(filters).forEach(filter => {
//
//         report.addFilter(filter);
//         filters[filter](row, noOfRows, report);
//
//       });
//
//     }
//
//     // Run single filter
//     else {
//
//       report.addFilter(filterName);
//       filters[filterName](row, noOfRows, report);
//
//     }
//
//   })
//   .on('end', function() {
//
//     report.saveNoOfRows(noOfRows);
//
//     // report.calcDatasetMetadata(1);
//     // report.printFilterReport('filter1');
//     report.calcFieldByFieldReport(1);
//
//     // report.calcDatasetMetadataAll(1);
//     // report.printReport(1);
//
//     // report.printReport();
//     // report.printFilterReport(1);
//
//     console.log('\n');
//     console.log('Exiting...');
//     console.log('\n');
//
//   });
