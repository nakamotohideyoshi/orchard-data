// Run single filter
var load_and_apply_filters = require('./load_and_apply_filters');
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
  load_and_apply_filters(input_file, [filter]);
}

catch(error) {
  throw(error);
}
