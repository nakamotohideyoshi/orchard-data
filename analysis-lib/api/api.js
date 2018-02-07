// Packages
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let analysisLibModule = require('../analysis-lib-module');

console.log("\n***** Initializing Analysis Lib Module API *****\n");

// DB interface
let dbInterface = new analysisLibModule.DbInterface();
dbInterface.init();

// Utils
let IO = new analysisLibModule.IO();
let constants = analysisLibModule.constants;
let utils = analysisLibModule.utils;

// Filters metadata
let filtersMeta = analysisLibModule.filtersMeta;
let explanationCriteria = 'userExplanation';

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

router.get('/api/field-by-field-report/:datasetId', (req, res) => {

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

router.get('/api/field-by-field-report-to-tsv/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let headers = ['dataRowId', 'description', 'fields'];

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {

      if(report.length === 0) {

        res.send(`Empty report for datasetId ${datasetId}.`);
        return;

      }

      return new Promise((resolve, reject) => {

        try {

          let parsed = headers.join("\t");
          parsed += "\n";

          report.forEach(row => {

            let fields = JSON.parse(row['test_data_field_ids']);
            let values = JSON.parse(row['test_data_field_values']);

            let occurrence = [
              row['test_data_row_id'],
              filtersMeta[row['criteria_id']][explanationCriteria],
              JSON.stringify(fields.map((name, i) => ({ 'name': name, 'value': values[i] })))
            ];

            parsed += occurrence.join("\t");
            parsed += "\n";

          });

          resolve(parsed);

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

router.get('/api/all-field-by-field-reports', (req, res) => {

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

// Row by Row Aggregation Report
router.get('/row-by-row/report/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          if(report.length === 0) {

            resolve(`Empty report for datasetId ${datasetId}.`);

          }


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

          });

          // Row by Row aggregation
          let RBRReport = utils.rowByRow(report);
          resolve(RBRReport);

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Row by Row Aggregation TSV
router.get('/row-by-row/tsv/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let headers = ['rowId', 'errors', 'warnings', 'grade'];

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          if(report.length === 0) {

            resolve(`Empty report for datasetId ${datasetId}.`);

          }

          let response = headers.join('\t');
          response += '\n';

          // Row by Row Aggregation
          let RBRReport = utils.rowByRow(report);

          // Mounts TSV response
          Object.keys(RBRReport).forEach(rowId => {

            let occurrence = RBRReport[rowId];
            let values = Object.keys(occurrence).map(key => occurrence[key]);

            response += values.join('\t');
            response += '\n';

          });

          resolve(response);

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

router.get('/api/batch-results-report/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchBatchResultsReport(datasetId)
    .then(report => res.send(report));

});

router.get('/api/all-batch-results-reports', (req, res) => {

  dbInterface.fetchAllBatchResultsReports()
    .then(report => res.send(report));

});

router.get('/api/dataset-meta', (req, res) => {

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

router.get('/api/tsv-dataset', (req, res) => {

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
