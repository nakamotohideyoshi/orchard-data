// Packages
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let analysisLibModule = require('../analysis-lib-module');

console.log("\n***** Initializing Analysis Lib Module API *****\n");

let dbInterface = new analysisLibModule.DbInterface();
dbInterface.init();

router.post('/api/save-and-run-filters', (req, res) => {

  let data = req.body;
  let datasetId;

  let dbPromise = dbInterface.saveDatasetMeta(data);
  dbPromise
    .then(result => {
      datasetId = result.lastID;
      let tsvPromise = dbInterface.saveTsvIntoDB(data.source, datasetId);
      return tsvPromise;
    })
    .then(() => analysisLibModule.runAllFilters(datasetId))
    .then(report => report.calcFieldByFieldReportAll())
    .then(report => dbInterface.saveFieldByFieldReport(report.FBFReport))
    .then(() => dbInterface.fetchFieldByFieldReport())
    .then(() => res.send("FINISHED"));
    // .then(FBFReport => console.log(FBFReport));

});

router.post('/api/fetch-field-by-field-report', (req, res) => {

  let promise = dbInterface.fetchFieldByFieldReport()
    .then(report => res.send(report));

});

// Export modules
module.exports = router;
