// DB Modules
let dbInfo = require('./src/db-scripts/db-info');
let dbInterfaceModule   = require('./src/db-scripts/db-interface-module');
let loadTsv = require('./src/db-scripts/add-tsv-to-db');

// Filters
let filtersDesc = require('./src/filters/filters-desc');
let filtersModule = require('./src/filters/filters-module');

// Main Script
let main = require('./src/scripts/main');

// Main scripts

module.exports = {

  'dbInfo': dbInfo,
  'dbInterfaceModule': dbInterfaceModule,
  'loadTsv': loadTsv,

  'filtersDesc': filtersDesc,
  'filtersModule': filtersModule,

  'main': main

}
