module.exports = function() {
  var descriptions = require('../filters/filters_desc');

  // Initializes report for a tsv file
  this.init = function(filename) {
    this.filename = filename;
    this['filters'] = {};
  };

  // Saves total number of rows for further analysis
  this.saveNoOfRows = function(noOfRows) {
    this.noOfRows = noOfRows;
  };

  // Adds a filter to the report
  this.addFilter = function(filterName) {

    var filterDesc = descriptions[filterName];

    if(this.filterName) {
      console.log("Trying to create a report for a filter which already exists. Ignoring...")
      return 0;
    }

    // Initializes objects
    this.filters[filterName] = {};
    this.filters[filterName]['occurs_on'] = [];

    Object.keys(filterDesc).forEach(key => this.filters[filterName][key] = filterDesc[key]);

    return 1;

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
        console.log(`${key}: ${this.filters[filter][key]}`);
        console.log("\n");
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
    var filter = `filter${filterId}`;

    try {
      Object.keys(this.filters[filter]).forEach(key => {
        console.log(`${key}: ${this.filters[filter][key]}`);
        console.log("\n");
      });
    }

    catch(error) {
      console.log("\n ***** Check filter ID and try again ***** \n");
      throw(error);
    }

  }

  // ---------- Analysis methods ----------

  this.calcStatistics = function(filter) {

    var noOfOccurrences = this.filters[filter]['occurs_on'].length;

    // Percentage of rows with this error
    this.filters[filter].error_percent = noOfOccurrences / this.noOfRows;

    // TODO: Weighted score for data quality
    this.filters[filter].error_score = Math.random() * 6;

  };

  this.calcDatasetMetadata = function(filterId) {

    var filter = `filter${filterId}`;
    this.calcStatistics(filter);

  };

  this.calcDatasetMetadataAll = function() {

    Object.keys(this['filters']).forEach(filter => this.calcStatistics(filter));

  };

  this.calcFieldByFieldReport = function(filterId) {
    var filter = `filter${filterId}`;

    this.filters[filter]['occurs_on'].forEach(occurrence => {

      console.log("\n");
      console.log("---------- Error Occurrences Summary ----------");

      console.log("\n");
      console.log(`Criteria_ID: ${filters[filter]['userExplanation']}`);

      console.log("\n");
      console.log(`Test Data Row ID: ${filters[filter]['userExplanation']}`);

      console.log("\n");
      console.log(`Criteria_ID: ${filters[filter]['userExplanation']}`);

      console.log("\n");
      console.log(`Criteria_ID: ${filters[filter]['userExplanation']}`);

    });
  };

  this.calcFieldByFieldReportAll = function() {

  };

  return this;
}
