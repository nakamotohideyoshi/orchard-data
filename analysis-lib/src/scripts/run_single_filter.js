// Run single filter
var load_tsv = require('./load_tsv');
var filters = require('../filters/filters-module');
var argv = require('minimist')(process.argv.slice(2));

var input_dir = ['data-tests', 'input-files'];
var input_file = argv["input"];
var filter_idx = argv["filter"];

// No filter specified
if(!input_file) {
  throw("No input file specified");
}

if(!filter_idx) {
  throw("No filter specified");
}

// Joins full path
input_file = input_dir.concat(input_file).join("/");

// Retrieves filter name
var filter = `filter${filter_idx}`;

try {
  // Gets stream object
  var stream = load_tsv(input_file);
  var headers = [];
  var tsvData = [];

  // Run chosen filter
  stream
    .on('headers', function(headers_list) {

      headers = headers_list;

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
