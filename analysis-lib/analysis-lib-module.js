// DB Modules
let dbInfo = require('./src/db-scripts/db-info');
let dbInterface   = require('./src/db-scripts/db-interface');

// Filters
let filtersDesc = require('./src/filters/filters-desc');
let filtersModule = require('./src/filters/filters-module');

// Main Script
let runAllFilters = require('./src/scripts/run-all-filters');

let constants = require('./src/scripts/constants');

// Main scripts

module.exports = {

  'dbInfo': dbInfo,
  'DbInterface': dbInterface,

  'filtersDesc': filtersDesc,
  'filtersModule': filtersModule,

  'runAllFilters': runAllFilters,
  'constants': constants

}
