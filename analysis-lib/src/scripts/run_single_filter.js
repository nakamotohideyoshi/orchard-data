// Run single filter

var filters = require('../filters/filters-module');
var argv = require('minimist')(process.argv.slice(2));

var input_file = argv["input"];
var filter_idx = argv["filter"];

// No filter specified
if(!input_file) {
  throw("No input file specified");
}

if(!filter_idx) {
  throw("No filter specified");
}

var filter = `filter${filter_idx}`;

try {
  filters[filter]();
}

catch(error) {
  console.log("\nCheck if filter index exists and try again\n");
  throw(error);
}
