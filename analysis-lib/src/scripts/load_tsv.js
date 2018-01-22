module.exports = function(input_file) {
  // load modules
  var fs  = require('fs');
  var csv = require('csv-parser');

  // Creates stream of data
  return fs.createReadStream(input_file)
    .pipe(csv({separator: '\t'}));
}
