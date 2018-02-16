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

// Fetch a TSV dataset
router.get('/dataset/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchTsvDataset(datasetId)
    .then(rows => res.send(rows));

});


// Sava TSV and run test cases
router.post('/dataset', (req, res) => {

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

// Sava TSV and run test cases
router.get('/run-filter/:filterId/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let filterId = "filter" + req.params.filterId;
  let datasetSize = 0;
  let report;

  analysisLibModule.runSingleFilter(datasetId, filterId)
    .then(rep => {
      report = rep;
      return report.calcFieldByFieldReportAll();
    })
    .then(() => report.calcBatchResultsReport())
    .then(() => dbInterface.getDatasetSize(datasetId))
    .then(result => {
      datasetSize = result[0]['COUNT(*)'];
      return Promise.resolve(datasetSize);
    })
    .then(() => {

      if(report.length === 0) {

        res.send(`Empty report for datasetId ${datasetId}.`);
        return;

      }

      return new Promise((resolve, reject) => {

        try { resolve(utils.fieldByFieldToTsv(report.FBFReport, datasetSize)); }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Fetch all reports
router.get('/field-by-field-reports', (req, res) => {

  dbInterface.fetchAllFieldByFieldReports()
    .then(report => {

      return new Promise((resolve, reject) => {

        try { resolve(utils.parseFieldByFieldReport(report)); }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Returns report as a TSV
router.get('/field-by-field-report/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result[0]['COUNT(*)'];
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {

      if(report.length === 0) {

        res.send(`Empty report for datasetId ${datasetId}.`);
        return;

      }

      return new Promise((resolve, reject) => {

        try { resolve(utils.fieldByFieldToTsv(report, datasetSize)); }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Fetch single report from DB
router.get('/field-by-field-report/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result[0]['COUNT(*)'];
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {

      return new Promise((resolve, reject) => {

        try { resolve(utils.parseFieldByFieldReport(report, datasetSize)); }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Row by Row Aggregation TSV
router.get('/row-by-row/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result[0]['COUNT(*)'];
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          let RBRReport = utils.rowByRow(report, datasetSize);
          resolve(utils.rowByRowToTsv(RBRReport));

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Row by Row Aggregation Report
router.get('/row-by-row/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result[0]['COUNT(*)'];
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId))
    .then(report => {

      return new Promise((resolve, reject) => {

        try { resolve(utils.rowByRow(report, datasetSize)); }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Error by Error Aggregation TSV
router.get('/error-by-error/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          if(report.length === 0) {

            resolve(`Empty report for datasetId ${datasetId}.`);

          }

          // Row by Row Aggregation
          let EBEReport = utils.errorByError(report);
          resolve(utils.errorByErrorToTsv(EBEReport));

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Error by Error Aggregation
router.get('/error-by-error/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchFieldByFieldReport(datasetId)
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          if(report.length === 0) {

            resolve(`Empty report for datasetId ${datasetId}.`);

          }

          // Row by Row Aggregation
          let EBEReport = utils.errorByError(report);
          resolve(EBEReport);

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Fetch single report summary
router.get('/report-summary/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;

  dbInterface.fetchBatchResultsReport(datasetId)
    .then(report => res.send(report));

});

// Fetch all report summaries
router.get('/report-summaries', (req, res) => {

  dbInterface.fetchAllBatchResultsReports()
    .then(report => res.send(report));

});

// Fetch params and status for a dataset
router.get('/dataset-meta/:rowId', (req, res) => {

  let rowId = req.params.rowId ;

  dbInterface.fetchDatasetMetaRow(rowId)
    .then(row => res.send(row));

});

// Fetch params for all datasets
router.get('/dataset-meta-all', (req, res) => {

  dbInterface.fetchDatasetMeta()
    .then(rows => res.send(rows));

});

// Export modules
module.exports = router;
