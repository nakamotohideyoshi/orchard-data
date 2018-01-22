module.exports = function(inputFile) {
  // load modules
  var fs  = require('fs');
  var csv = require('csv-parser');

  var headers = [];
  var tsvData = [];

  // Creates stream of data
  fs.createReadStream(inputFile)
    .pipe(csv({separator: '\t'}))
    .on('headers', function(headersList) {
      headers = headersList;
    })
    .on('data', function(row) {
    })
    .on('end', function() {
      console.log('Exiting...');
    });
}
