// DB Modules
let dbInfo = require('./src/db-scripts/db-info');
let dbInterface   = require('./src/db-scripts/db-interface');

// Filters
let filtersDesc = require('./src/filters/filters-desc');
let filtersModule = require('./src/filters/filters-module');

// Main Script
let main = require('./src/scripts/main');

// Main scripts

module.exports = {

  'dbInfo': dbInfo,
  'dbInterface': dbInterface,

  'filtersDesc': filtersDesc,
  'filtersModule': filtersModule,

  'main': main

}
