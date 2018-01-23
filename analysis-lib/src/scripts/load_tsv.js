module.exports = function(inputFile) {
  // load modules
  var fs  = require('fs');
  var csv = require('csv-parser');

  // Creates stream of data
  return fs.createReadStream(inputFile)
    .pipe(csv({separator: '\t'}));
}
