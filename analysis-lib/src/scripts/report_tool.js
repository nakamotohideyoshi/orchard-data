module.exports = function() {
  var descriptions = require('../filters/filters_desc');

  // Initializes report for a tsv file
  this.init = function(filename) {
    this.filename = filename;
    this['filters'] = {};
  };

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
    this['filters'][filterName] = {};
    this['filters'][filterName]['occurences'] = [];

    Object.keys(filterDesc).forEach(key => this['filters'][filterName][key] = filterDesc[key]);

    return 1;

  };

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
    Object.keys(this['filters']).forEach((filter, idx) => {

      console.log(`----- Filter ${idx + 1} -----`);
      console.log("\n");

      Object.keys(this['filters'][filter]).forEach(key => {
        console.log(`${key}: ${this['filters'][filter][key]}`);
        console.log("\n");
      });

    });

  };

  this.printFilterReport = function(filter) {

    console.log("---------- Report Summary ----------");
    console.log("\n");
    console.log(`Filename: ${this.filename}`);
    console.log("\n");
    console.log(`Number of rows: ${this.noOfRows}`);

    console.log("\n");
    console.log(`----- Filter ${filter} -----`);
    console.log("\n");

    // Filter string
    filter = `filter${filter}`;

    try {
      Object.keys(this['filters'][filter]).forEach(key => {
        console.log(`${key}: ${this['filters'][filter][key]}`);
        console.log("\n");
      });
    }

    catch(error) {
      console.log("\n ***** Check filter ID and try again ***** \n");
      throw(error);
    }

  }

  return this;
}
