// Run single filter

var filters = require('../filters/filters-module');
var filter_idx = process.argv[2];

// No filter specified
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

