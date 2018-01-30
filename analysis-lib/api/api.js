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
  let report;

  console.log("Running filters");

  let dbPromise = dbInterface.saveDatasetMeta(data);
  dbPromise
    .then(result => {
      datasetId = result.lastID;
      let tsvPromise = dbInterface.saveTsvIntoDB(data.source, datasetId);
      return tsvPromise;
    })
    .then(() => analysisLibModule.runAllFilters(datasetId))
    .then(rep => {
      report = rep;
      return report.calcFieldByFieldReportAll(datasetId)
    })
    .then(rep => dbInterface.saveFieldByFieldReport(report.FBFReport))
    .then(() => report.calcBatchResultsReportAll(datasetId))
    .then(rep => dbInterface.saveBatchResultsReport(report.BRReport));
    // .then(FBFReport => console.log(FBFReport));

});

router.post('/api/fetch-field-by-field-report', (req, res) => {

  let promise = dbInterface.fetchFieldByFieldReport()
    .then(report => res.send(report));

});

router.post('/api/fetch-batch-results-report', (req, res) => {

  let promise = dbInterface.fetchBatchResultsReport()
    .then(report => res.send(report));

});

router.post('/api/fetch-dataset-meta', (req, res) => {

  let rowId = req.body.rowId;
  let promise;

  if(!rowId) {
    promise = dbInterface.fetchDatasetMeta()
      .then(rows => res.send(rows));
  }

  else {
    promise = dbInterface.fetchDatasetMetaRow(rowId)
      .then(row => res.send(row));
  }

});

// Export modules
module.exports = router;
