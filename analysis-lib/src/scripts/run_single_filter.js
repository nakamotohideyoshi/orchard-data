// Run single filter
var loadTsv = require('./load_tsv');
var filters = require('../filters/filters-module');
var argv = require('minimist')(process.argv.slice(2));

var inputDir = ['data-tests', 'input-files'];
var inputFile = argv["input"];
var filterIdx = argv["filter"];

// No filter specified
if(!inputFile) {
  throw("No input file specified");
}

if(!filterIdx) {
  throw("No filter specified");
}

// Joins full path
inputFile = inputDir.concat(inputFile).join("/");

// Retrieves filter name
var filter = `filter${filterIdx}`;

try {
  // Gets stream object
  var stream = loadTsv(inputFile);
  var headers = [];
  var tsvData = [];

  // Run chosen filter
  stream
    .on('headers', function(headersList) {

      headers = headersList;

    })
    .on('data', function(row) {

      filters[filter](row);

    })
    .on('end', function() {

      console.log('Exiting...');

    });
}

catch(error) {
  throw(error);
}
