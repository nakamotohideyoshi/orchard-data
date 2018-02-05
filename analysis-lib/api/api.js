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
      res.send({ "dataset-id": datasetId });
      let tsvPromise = dbInterface.saveTsvIntoDB(data.source, datasetId);
      return tsvPromise;
    })
    .then(() => analysisLibModule.runAllFilters(datasetId))
    .then(rep => {
      report = rep;
      return report.calcFieldByFieldReportAll();
    })
    .then(rep => dbInterface.saveFieldByFieldReport(report.FBFReport))
    .then(() => report.calcBatchResultsReport())
    .then(rep => dbInterface.saveBatchResultsReport(report.BRReport))
    .then(() => console.log("Finished"));
    // .then(FBFReport => console.log(FBFReport));

});

router.get('/api/fetch-field-by-field-report/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {

      let response = [];

      report.forEach(row => {

        let fields = JSON.parse(row['test_data_field_ids']);
        let values = JSON.parse(row['test_data_field_values']);

        let occurrence = {
          'criteriaId': row['criteria_id'],
          'dataRowId': row['test_data_row_id'],

          'fields': fields.map((name, i) => ({ 'name': name, 'value': values[i] }))
        };

        response.push(occurrence);

      })

      res.send(response)

    });

});

router.get('/api/fetch-all-field-by-field-reports', (req, res) => {

  dbInterface.fetchAllFieldByFieldReports()
    .then(report => {

      let response = [];

      report.forEach(row => {

        let fields = JSON.parse(row['test_data_field_ids']);
        let values = JSON.parse(row['test_data_field_values']);

        let occurrence = {
          'criteriaId': row['criteria_id'],
          'dataRowId': row['test_data_row_id'],

          'fields': fields.map((name, i) => ({ 'name': name, 'value': values[i] }))
        };

        response.push(occurrence);

      })

      res.send(response);

    });

});

router.get('/api/fetch-batch-results-report/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchBatchResultsReport(datasetId)
    .then(report => res.send(report));

});

router.get('/api/fetch-all-batch-results-reports', (req, res) => {

  dbInterface.fetchAllBatchResultsReports()
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

router.post('/api/fetch-tsv-dataset', (req, res) => {

  let datasetId = req.body['dataset-id'];
  let promise;

  if(datasetId) {
    promise = dbInterface.fetchTsvDataset(datasetId)
      .then(rows => res.send(rows));
  }

  else {
    res.send(new Promise.reject("No dataset ID specified"));
  }

});

// Export modules
module.exports = router;
