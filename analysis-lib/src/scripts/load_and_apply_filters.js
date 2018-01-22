module.exports = function(input_file, filters_to_apply) {
  // load modules
  var fs  = require('fs');
  var csv = require('csv-parser');
  var filters = require('../filters/filters-module');

  var headers = [];
  var tsv_data = [];

  // Creates stream of data
  fs.createReadStream(input_file)
    .pipe(csv({separator: '\t'}))
    .on('headers', function(headers_list) {

      headers = headers_list;

    })
    .on('data', function(row) {

      // Apply filters
      filters_to_apply.forEach(filter => {
        filters[filter](row);
      });

    })
    .on('end', function() {

      console.log('Exiting...');

    });
}
