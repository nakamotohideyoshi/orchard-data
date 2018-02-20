module.exports = function() {

  // load modules
  let fs  = require('fs');
  let csvParser = require('csv-parse');
  let csvWriter = require('csv-write-stream');
  let Promise = require('bluebird');

  this.readTsv = function(inputFile) {
    const data = [];

    return new Promise((resolve, reject) => {
      // Checks if file exist
      if(fs.existsSync(inputFile)) {
        // Creates stream of data
        let stream = fs.createReadStream(inputFile, { encoding: "utf-8" });
        let parser = csvParser({
          delimiter: '\t',
          columns: true,
          quote: "`"
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });

        stream.pipe(parser);
      } else {
        reject(new Error('File does not exist'));
      }
    });
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
