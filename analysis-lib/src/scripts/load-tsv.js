module.exports = function(inputFile) {
  // load modules
  let fs  = require('fs');
  let csv = require('csv-parser');

  // Creates stream of data
  return fs.createReadStream(inputFile, { encoding: "utf-8" })
    .pipe(csv({separator: '\t'}));
};
