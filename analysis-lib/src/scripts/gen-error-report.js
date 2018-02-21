let csvParser = require('csv-parse/lib/sync');
let argv = require('minimist')(process.argv.splice(2));

let dbInterfaceModule = require('../db-scripts/db-interface');
let IOModule = require('./IO-module');
let utils = require('./utils');

let input = argv['input'];
let category = argv['category'];

let dbInterface = new dbInterfaceModule();

let parseReport = function(report) {

  let parsedReport = [];

  report.forEach(occurrence => {

    let data = {
      'criteria_id': occurrence['criteriaId']
    };

    parsedReport.push(data);

  });

  return parsedReport;

};

try {

  if(!input) {

    let reportString = argv["_"][0];

    let parserOpts = {
      delimiter: '\t',
      columns: true,
      quote: "`"
    };

    let report = csvParser(reportString, parserOpts);

    if(report.length === 0) {
      console.log(`Empty Report. Exiting...`);
      return;
    }

    let datasetSize = report[0]['datasetSize'] || 0;
    let parsedReport = parseReport(report);

    let EBRReport = utils.errorByError(parsedReport, category);
    console.log(utils.errorByErrorToTsv(EBRReport));

  }

  // Opens File
  else {

    let IO = new IOModule();

    IO.readTsv(input)
      .then(FBFReport => {

        return new Promise((resolve, reject) => {

          try {

            if(FBFReport.length === 0) {
              resolve(`Empty Report. Exiting...`);
            }

            let parsedReport = parseReport(FBFReport);
            let EBEReport = utils.errorByError(parsedReport, category);
            resolve(utils.errorByErrorToTsv(EBEReport));

          }

          catch(err) { reject(err); }

        });

      })
      .then(result => console.log(result));

  }

}

catch(err) { throw(err); }
