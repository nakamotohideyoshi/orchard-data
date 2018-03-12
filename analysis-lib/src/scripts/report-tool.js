function ReportModule() {

  let filtersMeta = require('../filters/filters-meta');
  let DATABASE = require('./constants').DATABASE;
  let Promise = require('bluebird');

  // Initializes database interface
  let dbInfo = require('../db-scripts/db-info');
  let dbInterfaceModule = require('../db-scripts/db-interface');
  let dbInterface = new dbInterfaceModule();
  dbInterface.init();

  /**
   * Initializes report for a tsv file.
   * @param datasetId
   */
  this.init = function(datasetId) {
    this.datasetId = datasetId;
    this['filters'] = {};
  };

  /**
   * Saves total number of rows for further analysis.
   * @param noOfRows
   */
  this.saveNoOfRows = function(noOfRows) {
    this.noOfRows = noOfRows;
  };

  /**
   * Adds a filter to the report. Skips if it already exists.
   * @param filterName
   * @returns {number}
   */
  this.addFilter = function(filterName) {

    let filterDesc = filtersMeta[filterName];

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

  /**
   * Adds an occurrence object to a given filterId.
   * An occurrence consists of the rowId, the field and the value where the error occurred.
   * @param filterId
   * @param occurrence
   */
  this.addOccurrence = function(filterId, occurrence) {

    // Filter string
    let filterRegex = /(filter)[0-9]+/i;
    let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

    let filterOccurrences = this.filters[filter]['occurs_on'];
    let rowId = occurrence['row_id'];
    let rowOccurrence = filterOccurrences[rowId];

    // Creates object to hold occurrences for given rowId
    if(!rowOccurrence) {

      rowOccurrence = {
        'row_id': rowId,
        'fields': [],
        'values': [],
        'explanations_ids': [],
        'error_types': [],
      };

    }

    rowOccurrence['fields'] = rowOccurrence['fields'].concat(occurrence['field']);
    rowOccurrence['values'] = rowOccurrence['values'].concat(occurrence['value']);
    rowOccurrence['explanations_ids'] = rowOccurrence['explanations_ids'].concat(occurrence['explanation_id']);
    rowOccurrence['error_types'] = rowOccurrence['error_types'].concat(occurrence['error_type']);

    filterOccurrences[rowId] = rowOccurrence;

  };

  /**
   * Prints reports and summaries of all filters
   */
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

  /**
   * Prints reports and summaries of single filter
   * @param filterId
   */
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

  /**
   * Calculates dataset metadata for a al filters
   */
  this.calcBatchResultsReport = function() {

    return new Promise((resolve, reject) => {

      let occurrences = [];
      let noOfRows = this.noOfRows;

      // Gets all occurrences
      Object.keys(this['filters']).forEach(filterId => {
        let filterOccursOn = Object.keys(this['filters'][filterId]['occurs_on']);
        occurrences = occurrences.concat(filterOccursOn)
      });

      // Gets all unique occurrences
      occurrences = occurrences.filter((v, i, a) => a.indexOf(v) === i);

      this.noOfErrors = occurrences.length;

      // Percentage of rows with any error
      let error_percent = this.noOfErrors / this.noOfRows;

      // TODO: Weighted score for data quality
      let error_score = Math.random() * 6;

      this.BRReport = {
        'dataset_id': this.datasetId,
        'no_of_rows': this.noOfRows,
        'no_of_errors': this.noOfErrors,
        'error_percent': error_percent,
        'error_score': error_score
      };

      resolve(this);

    });

  };

  /**
   * Calculates a field by field report for given filter
   * @param filterId
   * @param verbose
   */
  this.calcFieldByFieldReport = function(filterId, verbose) {

    // If report was already calculated, just returns
    this.FBFReport = this.FBFReport || [];

    // if(this.FBFReport.length > 0) { return; }

    let filterRegex = /(filter)[0-9]+/i;
    let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

    console.log("\n");
    console.log(`---------- Calculating Field by Field Report - ${filter} ----------`);
    console.log("\n");

    Object.keys(this.filters[filter]['occurs_on']).forEach(rowId => {

      let occurrence = this.filters[filter]['occurs_on'][rowId];

      let values = {
        'dataset_id': this.datasetId,
        'criteria_id': filter,
        'test_data_row_id': occurrence['row_id'],
        'test_data_field_ids': JSON.stringify(occurrence['fields']),
        'test_data_field_values': JSON.stringify(occurrence['values']),
        'test_data_field_explanations_ids': JSON.stringify(occurrence['explanations_ids']),
        'test_data_field_error_types': JSON.stringify(occurrence['error_types']),
      };

      this.FBFReport.push(values);

      if(verbose) {

        console.log("\n");
        console.log(`Criteria_ID: ${this.filters[filter]['userExplanation']}`);

        console.log("\n");
        console.log(`Test Data Row ID: ${occurrence['rowId']}`);

        console.log("\n");
        console.log(`Test Data Fields ID: ${occurrence['fields']}`);

        console.log("\n");
        console.log(`Test Data Fields Values : ${occurrence['values']}`);
        console.log("\n");

      }

    });

  };

  /**
   * Calculates a field by field report for all filters
   */
  this.calcFieldByFieldReportAll = function() {

    return new Promise((resolve, reject) => {

      Object.keys(this['filters']).forEach(filter => this.calcFieldByFieldReport(filter));
      resolve(this.FBFReport);

    },
    (err) => reject(err));

  };

}

module.exports = ReportModule;