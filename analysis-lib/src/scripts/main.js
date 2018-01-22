// Run all filters
var load_tsv = require('./load_tsv');
var filters = require('../filters/filters-module');
var argv = require('minimist')(process.argv.slice(2));

var input_dir = ['data-tests', 'input-files'];
var input_file = argv["input"];

// No filter specified
if(!input_file) {
  throw("No input file specified");
}

// Joins full path
input_file = input_dir.concat(input_file).join("/");

// Gets stream object
var stream = load_tsv(input_file);
var headers = [];
var tsvData = [];

// Run filters
stream
  .on('headers', function(headers_list) {

    headers = headers_list;

  })
  .on('data', function(row) {

    Object.keys(filters).forEach(filter => {
      filters[filter](row);
    });

  })
  .on('end', function() {

    console.log('Exiting...');

  });
