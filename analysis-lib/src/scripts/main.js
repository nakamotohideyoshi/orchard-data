// Run all filters

var filters = require('../filters/filters-module');
var argv = require('minimist')(process.argv.slice(2));

var input_file = argv["input"];

// No filter specified
if(!input_file) {
  throw("No input file specified");
}

console.log(filters);
