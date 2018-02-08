let IOModule = require('./IO-module');
let argv = require('minimist')(process.argv.splice(2));
let rowByRow = require('./utils').rowByRow;

let input = argv['input'];

if(!input) {
  throw("\n ***** No Input File Specified *****\n");
}

try {

  let IO = new IOModule();

  IO.readTsv(input)
    .then(FBFReport => {

      return new Promise((resolve, reject) => {

        try {

          let parsedReport = [];

          FBFReport.forEach(occurrence => {

            let data = {
              'test_data_row_id': occurrence['dataRowId'],
              'criteria_id': occurrence['criteriaId']
            };

            parsedReport.push(data);

          });

          resolve(rowByRow(parsedReport));

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => console.log(result));

}

catch(err) { throw(err); }
