// DB Modules
let dbInfo = require('./src/db-scripts/db-info')
let dbInterface = require('./src/db-scripts/db-interface')

// Filters
let filtersMeta = require('./src/filters/filters-meta')
let path = require('path')
let filtersModule = require('require-all')(path.join(__dirname, '/src/filters'))

// Main Script
let runAllFilters = require('./src/scripts/run-all-filters')
let runSingleFilter = require('./src/scripts/run-single-filter')
let runVACount = require('./src/scripts/run-va-count')

let constants = require('./src/scripts/constants')
let IO = require('./src/scripts/IO-module')
let reportUtils = require('./src/scripts/report-utils')

// Main scripts

module.exports = {

  'dbInfo': dbInfo,
  'DbInterface': dbInterface,

  'filtersMeta': filtersMeta,
  'filtersModule': filtersModule,

  'runAllFilters': runAllFilters,
  'runSingleFilter': runSingleFilter,
  'runVACount': runVACount,
  'constants': constants,
  'IO': IO,
  'reportUtils': reportUtils

}
