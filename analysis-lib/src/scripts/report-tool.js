module.exports = function() {

  let descriptions = require('../filters/filters-desc');
  let dbInfo = require('../db-scripts/db-info');

  // Initializes database interface
  let dbInterfaceModule = require('../db-scripts/db-interface-module');
  let dbInterface = new dbInterfaceModule();

  // Initializes report for a tsv file
  this.init = function(filename) {
    this.filename = filename;
    this['filters'] = {};

    // Loads database
    this.db = dbInfo['analysis-lib'];
    dbInterface.loadDB(this.db.path.concat(this.db.name).join("/"));
  };

  // Saves total number of rows for further analysis
  this.saveNoOfRows = function(noOfRows) {
    this.noOfRows = noOfRows;
  };

  // Adds a filter to the report. Skips if it already exists
  this.addFilter = function(filterName) {

    let filterDesc = descriptions[filterName];

    // Filter already exists
    if(this.filters[filterName]) {
      return;
    }

    // Initializes objects
    this.filters[filterName] = {};
    this.filters[filterName]['occurs_on'] = {};

    Object.keys(filterDesc).forEach(key => this.filters[filterName][key] = filterDesc[key]);

    return 1;

  };

  // Adds an occurrence object to a given filterId
  // An occurrence consists of the rowId, the field and the value
  // where the error occurred
  this.addOccurrence = function(filterId, occurrence) {

    // Filter string
    let filterRegex = /(filter)[0-9]+/i;
    let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

    let filterOccurrences = this.filters[filter]['occurs_on'];

    let rowId = occurrence['rowId'];

    // Creates object to hold occurrences for given rowId
    if(!filterOccurrences[rowId]) {

      filterOccurrences[rowId] = {
        'rowId': rowId,
        'fields': [],
        'values': []
      };

    }

    filterOccurrences[rowId]['fields'].push(occurrence['field']);
    filterOccurrences[rowId]['values'].push(occurrence['value']);

  };

  // Prints reports and summaries of all filters
  this.printReport = function () {

    console.log("---------- Report Summary ----------");
    console.log("\n");
    console.log(`Filename: ${this.filename}`);
    console.log("\n");
    console.log(`Number of rows: ${this.noOfRows}`);

    console.log("\n");
    console.log("---------- Filters Summary ----------");
    console.log("\n");

    // Print all filters summary
    Object.keys(this.filters).forEach((filter, idx) => {

      console.log(`----- Filter ${idx + 1} -----`);
      console.log("\n");

      Object.keys(this.filters[filter]).forEach(key => {

        let value = this.filters[filter][key];

        if(typeof(value) === 'object') {
          console.log(`${key}: ${Object.keys(value)}`);
          console.log("\n");
        }

        else {
          console.log(`${key}: ${value}`);
          console.log("\n");
        }

      });

    });

  };

  // Prints reports and summaries of single filter
  this.printFilterReport = function(filterId) {

    console.log("---------- Report Summary ----------");
    console.log("\n");
    console.log(`Filename: ${this.filename}`);
    console.log("\n");
    console.log(`Number of rows: ${this.noOfRows}`);

    console.log("\n");
    console.log(`----- Filter ${filterId} -----`);
    console.log("\n");

    // Filter string
    let filterRegex = /(filter)[0-9]+/i;
    let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

    try {

      Object.keys(this.filters[filter]).forEach(key => {

        let value = this.filters[filter][key];

        if(typeof(value) === 'object') {
          console.log(`${key}: ${Object.keys(value)}`);
          console.log("\n");
        }

        else {
          console.log(`${key}: ${value}`);
          console.log("\n");
        }

      });

    }

    catch(error) {

      console.log("\n ***** Check filter ID and try again ***** \n");
      throw(error);

    }

  };

  // ---------- Analysis methods ---------- //

  // Calculates percentage of rows with a given error (filter)
  this.calcStatistics = function(filter) {

    let noOfOccurrences = Object.keys(this.filters[filter]['occurs_on']).length;

    // Percentage of rows with this error
    this.filters[filter].error_percent = noOfOccurrences / this.noOfRows;

    // TODO: Weighted score for data quality
    this.filters[filter].error_score = Math.random() * 6;

  };

  // Calculates dataset metadata for a given filter
  this.calcDatasetMetadata = function(filterId) {

    let filterRegex = /(filter)[0-9]+/i;
    let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

    this.calcStatistics(filter);

  };

  // Calculates dataset metadata for a al filters
  this.calcDatasetMetadataAll = function() {

    Object.keys(this['filters']).forEach(filter => this.calcStatistics(filter));

  };

  // Calculates a field by field report for given filter
  this.calcFieldByFieldReport = function(filterId) {

    let filterRegex = /(filter)[0-9]+/i;
    let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

    var table = this.db['tables']['field_by_field_reports'];

    console.log("\n");
    console.log(`---------- Error Occurrences Summary - ${filter} ----------`);

    Object.keys(this.filters[filter]['occurs_on']).forEach(rowId => {

      let occurrence = this.filters[filter]['occurs_on'][rowId];

      let values = [];

      values.push(filter);
      values.push(this.filename);
      values.push(this.filters[filter]['userExplanation']);
      values.push(occurrence['rowId']);
      values.push(JSON.stringify(occurrence['fields']));
      values.push(JSON.stringify(occurrence['values']));

      dbInterface.insertRowOnTable(values, table.name);

      console.log("\n");
      console.log(`Criteria_ID: ${this.filters[filter]['userExplanation']}`);

      console.log("\n");
      console.log(`Test Data Row ID: ${occurrence['rowId']}`);

      console.log("\n");
      console.log(`Test Data Fields ID: ${occurrence['fields']}`);

      console.log("\n");
      console.log(`Test Data Fields Values : ${occurrence['values']}`);
      console.log("\n");

    });

  };

  // Calculates a field by field report for all filters
  this.calcFieldByFieldReportAll = function() {

    Object.keys(this['filters']).forEach(filter => this.calcFieldByFieldReport(filter));

  };

  return this;

};
