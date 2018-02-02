module.exports = function(inputFile) {
  // load modules
  let fs  = require('fs');
  let csv = require('csv-parser');
  let Promise = require('bluebird');

  let streamToPromise = function(stream) {
    let data = [];

    return new Promise((resolve, reject) => {

      stream.on("data", (row) => data.push(row));
      stream.on("error", reject);
      stream.on("end", () => resolve(data));

    });
  }
  // Creates stream of data
  let stream = fs.createReadStream(inputFile, { encoding: "utf-8" })
    .pipe(csv({separator: '\t'}));

  return streamToPromise(stream);
};
