module.exports = function() {

  let sqlite = require('sqlite');
  let Promise = require('bluebird');
  let dbInfo = require('./db-info');
  let readTsv = require('../scripts/read-tsv');
  let DATABASE = require('../scripts/constants').DATABASE;

  // stores db path
  this.init = function() {

    this.dbPath = dbInfo[DATABASE].path.concat(dbInfo[DATABASE].name).join("/");

    this.dbStatus = {
      'OK': 1,
      'FAIL': 2,
      'INPROGRESS': 3
    };

  };

  // Loads TSV File into DATABASE
  this.saveTsvIntoDB = function(inputPath, datasetId) {

    // The table to add the TSV Files
    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];
    let tsvFile;

    let dbPromise = readTsv(inputPath)
      .then(file => tsvFile = file)
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => this.updateDatasetStatus(datasetId, this.dbStatus.INPROGRESS))
      .then(db => {

        return Promise.map(tsvFile, (row) => {

          let values = [datasetId];
          Object.keys(row).forEach(key => values.push(row[key]));

          let placeholders = values.map((val) => '(?)').join(',');
          let stmt = `INSERT INTO ${orchardTable.name} VALUES (${placeholders})`;

          return db.run(stmt, values)
            .then((result) => {
              console.log(`Rows inserted: ${result.changes} with rowId: ${result.lastID}`);
            },
            (err) => { console.log(err); }
                 );
        });

      })
      .then(() => this.updateDatasetStatus(datasetId, this.dbStatus.OK))
      .catch(err => {
        this.updateDatasetStatus(datasetId, this.dbStatus.ERROR);
        return err;
      });

    return dbPromise;

  };

  this.updateDatasetStatus = function(datasetId, status, dbPromise) {

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta'];

    dbPromise = dbPromise || Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }));

    dbPromise.then(db => db.run(`
        UPDATE ${datasetMetaTable.name}
        SET status = ${status}
        WHERE rowId = ${datasetId}
      `));

    return dbPromise;

  };

  this.saveDatasetMeta = function(metadata) {

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta'];

    try {

      let dbPromise = Promise.resolve()
        .then(() => sqlite.open(this.dbPath, { Promise }))
        .then(db => {

          let values = [];

          Object.keys(metadata).forEach(key => values.push(metadata[key]));

          let placeholders = values.map((val) => '(?)').join(',');
          let fields = Object.keys(metadata);

          let stmt = `INSERT INTO ${datasetMetaTable.name} (${fields}) VALUES (${placeholders})`;

          return db.run(stmt, values)
            .then((result) => {
                console.log(`Rows inserted: ${result.changes} with ID: ${result.lastID}`);

                return result;
              },
              (err) => { console.log(err); }
            );

        });

      return dbPromise;

    }

    catch (err) {

      next(err);

    }

  };

  this.fetchDatasetMeta = function() {

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${datasetMetaTable.name}`));

    return dbPromise;

  }

  this.fetchDatasetMetaRow = function(rowId) {

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${datasetMetaTable.name} WHERE rowId = ${rowId}`));

    return dbPromise;

  }

  // Clears a table - DEV only
  this.clearTable = function(tableName) {

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.run(`DELETE FROM ${tableName}`));

    return dbPromise;

  };

  // Returns rows with given datasetId from the orchard table
  this.fetchTsvDataset = function(datasetId) {

    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT * FROM ${orchardTable.name} WHERE dataset_id = '${datasetId}'`));

    return dbPromise;

  };

  // Save field by field report
  this.saveFieldByFieldReport = function(report) {

    var reportTable = dbInfo[DATABASE]['tables']['field_by_field_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {

        return Promise.map(report, (row) => {

          let columns = Object.keys(row);
          let values = columns.map((val) => row[val]);
          let placeholders = columns.map((val) => '(?)').join(',');
          let stmt = `INSERT INTO ${reportTable.name}(${columns}) VALUES (${placeholders})`;

          return db.run(stmt, values)
            .then((result) => {
              console.log(`Rows inserted: ${result.changes}`);
            },
              (err) => { console.log(err); }
            );

        });

      });

    return dbPromise;

  };

  // Save field by field report
  this.saveBatchResultsReport = function(report) {

    var reportTable = dbInfo[DATABASE]['tables']['batch_results_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {

          let columns = Object.keys(report);
          let placeholders = columns.map((val) => '(?)').join(',');
          let stmt = `INSERT INTO ${reportTable.name}(${columns}) VALUES(${placeholders})`;
          let values = Object.keys(report).map(key => report[key]);

          return db.run(stmt, values)
            .then((result) => {
              console.log(`Rows inserted: ${result.changes}`);
            },
              (err) => { console.log(err); }
            );

      });

    return dbPromise;

  };

  this.fetchFieldByFieldReport = function(datasetId) {

    let FBFReportTable = dbInfo[DATABASE]['tables']['field_by_field_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`
        SELECT rowId, *
        FROM ${FBFReportTable.name}
        WHERE dataset_id = ${datasetId}
      `));

    return dbPromise;

  };

  this.fetchAllFieldByFieldReports = function() {

    let FBFReportTable = dbInfo[DATABASE]['tables']['field_by_field_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${FBFReportTable.name}`));

    return dbPromise;

  };

  this.fetchBatchResultsReport = function(datasetId) {

    let reportTable = dbInfo[DATABASE]['tables']['batch_results_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`
        SELECT rowId, *
        FROM ${reportTable.name}
        WHERE dataset_id = ${datasetId}
      `));

    return dbPromise;

  };

  this.fetchAllBatchResultsReports = function() {

    let reportTable = dbInfo[DATABASE]['tables']['batch_results_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${reportTable.name}`));

    return dbPromise;

  };

};
