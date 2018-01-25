// Run all filters
let loadTsv = require('./load-tsv');
let filters = require('../filters/filters-module');
let reportToolModule = require('./report-tool');
let argv = require('minimist')(process.argv.slice(2));

let inputDir = ['data-tests', 'input-files'];
let inputFile = argv.input;

// Retrieves filter name
let filterName = `filter${argv.filter}`;

// Run all filters if no filter was specified or does not exist
let runAll = !argv.filter;

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
report.init(inputFile);

// No filter specified
if(!inputFile) {
  throw("No input file specified");
}

// Joins full path
inputFile = inputDir.concat(inputFile).join("/");

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
