module.exports = function() {

  // load modules
  let fs  = require('fs');
  let csvParser = require('csv-parser');
  let csvWriter = require('csv-write-stream');
  let Promise = require('bluebird');

  this.readTsv = function(inputFile) {

    let handler = function(e) { console.log("bilola"); console.log(e); };

    let streamToPromise = function(stream) {
      let data = [];

      return new Promise((resolve, reject) => {

        stream.on("data", (row) => data.push(row));
        stream.on("error", reject);
        stream.on("end", () => resolve(data));

      });
    };

    // Creates stream of data
    let stream = fs.createReadStream(inputFile, { encoding: "utf-8" })
      .pipe(csvParser({separator: '\t'}));

    return streamToPromise(stream);

  };

  this.writeTsv = function(outPath, data, headers) {

    // Creates stream of data
    let writer = csvWriter({
      'headers': headers,
      'separator': '\t'
    });

    if(data.length === 0) { return new Promise.resolve([]); }

    let stream = fs.createWriteStream(outPath);
    writer.pipe(stream);

    return new Promise((resolve, reject) => {

        try {

          data.forEach(element => writer.write(element));
          writer.end();
          resolve("SUCESS");

        }

        catch(err) {

          reject(err);

        }

    });

  };

};
