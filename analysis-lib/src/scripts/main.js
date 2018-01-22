// Run all filters
var load_and_apply_filters = require('./load_and_apply_filters');
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

// All filters
var filters_to_apply = Object.keys(filters);

// Load file and apply filters
load_and_apply_filters(input_file, filters_to_apply);
