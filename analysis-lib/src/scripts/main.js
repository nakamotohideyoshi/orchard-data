// Run all filters
var loadTsv = require('./load_tsv');
var filters = require('../filters/filters-module');
var reportToolModule = require('./report_tool');
var argv = require('minimist')(process.argv.slice(2));

var inputDir = ['data-tests', 'input-files'];
var inputFile = argv["input"];

// Initializes report for given tsv file
var report = new reportToolModule();
report.init(inputFile);

// No filter specified
if(!inputFile) {
  throw("No input file specified");
}

// Joins full path
inputFile = inputDir.concat(inputFile).join("/");

// Gets stream object
var stream = loadTsv(inputFile);
var headers = [];
var noOfRows = 0;
// var tsvData = [];

// Run filters
stream
  .on('headers', function(headersList) {

    headers = headersList;

  })
  .on('data', function(row, idx) {

    noOfRows += 1;

    Object.keys(filters).forEach(filter => {
      report.addFilter(filter);
      filters[filter](row, noOfRows, report);
    });

  })
  .on('end', function() {

    report.saveNoOfRows(noOfRows);

    // report.calcDatasetMetadata(1);
    // report.printFilterReport(1);

    report.calcDatasetMetadataAll(1);
    report.printReport(1);

    // report.printReport();
    // report.printFilterReport(1);

    console.log('Exiting...');

  });
