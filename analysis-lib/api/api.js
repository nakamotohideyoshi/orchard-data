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
  res.type('text/tab-separated-values');

  dbInterface.fetchTsvDataset(datasetId)
    .then(rows => res.status(200).send(rows));

});

// Sava TSV and run test cases
router.post('/dataset', async(req, res) => {

  const data = req.body;

  try {

    console.log("\n***** Saving Dataset Metadata *****");

    const { datasetId } = await dbInterface.saveDatasetMeta(data);

    console.log("***** Done *****\n");
    console.log("***** Saving Tsv File *****");

    await dbInterface.saveTsvIntoDB(data.source, datasetId);

    console.log("***** Done *****\n");
    console.log("***** Running all Filters *****");

    const report = await analysisLibModule.runAllFilters(datasetId);

    console.log("***** Done *****\n");
    console.log("***** Calculating Field by Field Report *****");

    await report.calcFieldByFieldReportAll();

    console.log("***** Done *****\n");
    console.log("***** Saving Field By Field Report *****");

    await dbInterface.saveFieldByFieldReport(report.FBFReport);

    console.log("***** Saved *****\n");
    console.log("***** Calculating Batch Results Report *****");

    await report.calcBatchResultsReport();

    console.log("***** Done *****\n");
    console.log("***** Saving Batch Results Report *****");

    await dbInterface.saveBatchResultsReport(report.BRReport);

    console.log("***** Done *****\n");
    console.log("***** FINISHED *****\n")

    res.status(201).json({ status: "OK", datasetId: datasetId })

  }

  catch(err) { res.status(500).json({ 'title': err.name, 'detail': err.message }); }

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
      datasetSize = result;
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
    .then(result => res.send(result))
    .catch(err => res.send(err));

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
router.get('/field-by-field/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  let datasetSize = 0;
  res.type('text/tab-separated-values');

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
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
    .then(result => res.send(result))
    .catch(err => res.send(err));

});

// Fetch single report from DB
router.get('/field-by-field/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
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

// Returns report as a TSV
router.get('/field-by-field/:category/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  let category = req.params.category ;
  let datasetSize = 0;
  res.type('text/tab-separated-values');

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
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
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).json({ title: err.name, detail: err.message }));

});

// Fetch single report from DB
router.get('/field-by-field/:category/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let category = req.params.category ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
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
  res.type('text/tab-separated-values');

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
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
      datasetSize = result;
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

// Row by Row Aggregation TSV
router.get('/row-by-row/:category/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  let category = req.params.category ;
  let datasetSize = 0;
  res.type('text/tab-separated-values');

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
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
router.get('/row-by-row/:category/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let category = req.params.category ;
  let datasetSize = 0;

  dbInterface
    .getDatasetSize(datasetId)
    .then(result => {
      datasetSize = result;
      return Promise.resolve(datasetSize);
    })
    .then(() => dbInterface.fetchFieldByFieldReport(datasetId, category))
    .then(report => {

      return new Promise((resolve, reject) => {

        try { resolve(utils.rowByRow(report, datasetSize)); }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Error by Error Aggregation TSV
// TODO: Merge error-by-error JSON and TSV endpoints
router.get('/error-by-error/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  res.type('text/tab-separated-values');

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

      if(report.length === 0) {
        throw new Error(`Empty report for datasetId ${datasetId}.`);
      }

      // Row by Row Aggregation
      let EBEReport = utils.errorByError(report);
      res.status(200).json(EBEReport);
    })
    .catch((e) => {
      res.status(400).json({ message: e.message });
    });

});

// Error by Error Aggregation TSV
router.get('/error-by-error/:category/:datasetId.tsv', (req, res) => {

  let datasetId = req.params.datasetId ;
  let category = req.params.category ;
  res.type('text/tab-separated-values');

  dbInterface.fetchFieldByFieldReport(datasetId, category)
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          if(report.length === 0) {

            resolve(`Empty report for datasetId ${datasetId}.`);

          }

          // Row by Row Aggregation
          let EBEReport = utils.errorByError(report, category);
          resolve(utils.errorByErrorToTsv(EBEReport));

        }

        catch(err) { reject(err); }

      });

    })
    .then(result => res.send(result));

});

// Error by Error Aggregation
router.get('/error-by-error/:category/:datasetId', (req, res) => {

  let datasetId = req.params.datasetId ;
  let category = req.params.category ;

  dbInterface.fetchFieldByFieldReport(datasetId, category)
    .then(report => {

      return new Promise((resolve, reject) => {

        try {

          if(report.length === 0) {

            resolve(`Empty report for datasetId ${datasetId}.`);

          }

          // Row by Row Aggregation
          let EBEReport = utils.errorByError(report, category);
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

// Return filters meta data
router.get('/config', (req, res) => {

  res.status(200).json(analysisLibModule.filtersMeta);

});


// Export modules
module.exports = router;
