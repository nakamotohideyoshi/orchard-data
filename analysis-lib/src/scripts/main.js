// Run all filters
var loadTsv = require('./load_tsv');
var filters = require('../filters/filters-module');
var argv = require('minimist')(process.argv.slice(2));

var inputDir = ['data-tests', 'input-files'];
var inputFile = argv["input"];

// No filter specified
if(!inputFile) {
  throw("No input file specified");
}

// Joins full path
inputFile = inputDir.concat(inputFile).join("/");

// Gets stream object
var stream = loadTsv(inputFile);
var headers = [];
var tsvData = [];

// Run filters
stream
  .on('headers', function(headersList) {

    headers = headersList;

  })
  .on('data', function(row) {

    Object.keys(filters).forEach(filter => {
      filters[filter](row);
    });

  })
  .on('end', function() {

    console.log('Exiting...');

  });
