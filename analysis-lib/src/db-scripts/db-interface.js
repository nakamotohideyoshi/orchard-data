module.exports = function() {

  let sqlite = require('sqlite');
  let Promise = require('bluebird');
  let dbInfo = require('./db-info');
  let IO = require('../scripts/IO-module');
  let DATABASE = require('../scripts/constants').DATABASE;

  let readTsv = new IO().readTsv;

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

    console.log("\n***** Saving TSV *****\n");

    // The table to add the TSV Files
    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];
    let fields_dict = orchardTable['columns_dict'];
    let tsvFile;

    let dbPromise = readTsv(inputPath)
      .then(file => tsvFile = file)
      .then(() => this.updateDatasetStatus(datasetId, this.dbStatus.INPROGRESS))
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {

        // Raw Fields
        let tsvFields = Object.keys(tsvFile[0]);
        let numberOfFields = tsvFields.length;

        // Filters are maped to datavase columns
        let fields = ['dataset_id'];
        Object.keys(tsvFile[0]).forEach(key => fields.push(fields_dict[key]));

        // Checks if TSV has missing or extra fields
        console.log("***** Checking Number of Fields *****\n");
        if(numberOfFields !== 52) {

          console.log("Error when trying to upload TSV\n");

          return Promise.reject({
            "thrower": "saveTsvIntoDB",
            "row_id": -1,
            "message": `Invalid number of fields: ${numberOfFields}`
          });

        }

        // Checks if some field is undefined
        console.log("***** Checking for undefined fields *****\n");
        for(let i = 0; i < fields.length; i++) {

          let field = fields[i];

          if(typeof(field) === 'undefined') {

            return Promise.reject({
              "thrower": "saveTsvIntoDB",
              "row_id": -1,
              "message": `Field "${tsvFields[i - 1]}" does not exist under table ${orchardTable.name} columns. Check db-info.js file.`
            });

          }

        }

        // If it has made this far, then it's ok
        console.log("***** Reading TSV File *****\n");

        return Promise.map(tsvFile, (row, idx) => {

          let values = [datasetId];
          Object.keys(row).forEach(key => values.push(row[key]));

          let placeholders = values.map((val) => '(?)').join(',');
          let stmt = `INSERT INTO ${orchardTable.name}(${fields}) VALUES (${placeholders})`;

          return db.run(stmt, values)
            .then((result) => {
              return Promise.resolve(this.dbStatus.OK);
            },
            (err) => {

              return Promise.reject({
                "thrower": "saveTsvIntoDB",
                "row_id": idx,
                "message": err
              });

            });

        });

      })
      .then(() => this.updateDatasetStatus(datasetId, this.dbStatus.OK))
      .then(() => console.log("***** Finished *****"));

    return dbPromise;

  };

  this.logErrorIntoDB = function(datasetId, error) {

    // The table to add the TSV Files
    let logsTable = dbInfo[DATABASE]['tables']['tsv_logs_table'];

    // Opens a new connection or uses an existing one
    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {

        let fields = ['dataset_id', 'row_id', 'message'];
        let values = [datasetId, error['row_id'] || -1, error['message'].toString()];

        let placeholders = values.map((val) => '(?)').join(',');
        let stmt = `INSERT INTO ${logsTable.name}(${fields}) VALUES (${placeholders})`;

        return db.run(stmt, values)
          .then((result) => {
            return Promise.resolve("OK");
          },
          (err) => {
            return Promise.reject({
              "thrower": "logErrorIntoDB",
              "message": err
            })
          });

      })
      .then(result => {
        console.log(`logIntoErrorDB returned status ${result}: ${this.dbStatus[result]}`);
        console.log("Log Completed");
      });

    return dbPromise;

  };

  // gets the number of lines of give dataset
  this.getDatasetSize = function(datasetId) {

    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT COUNT(*) FROM ${orchardTable.name} WHERE dataset_id = '${datasetId}'`));

    return dbPromise;

  };

  this.updateDatasetStatus = function(datasetId, status) {

    console.log(`***** Updating dataset status: ${status} *****\n`);

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {

        return db.run(`
          UPDATE ${datasetMetaTable.name}
          SET status = ${status}
          WHERE rowId = ${datasetId}
        `)
        .then(result => { return Promise.resolve(result); },
        (err) => {
          console.log("ROLA");
          console.log(err);
          console.log(err.message);
          return Promise.reject({
            "message": err.message,
            "row_id": -1
          })
        });

      });

    return dbPromise;

  };

  this.saveDatasetMeta = function(metadata) {

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta'];

    try {

      let dbPromise = readTsv(metadata.source)
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

      return Promise.reject(err);

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

    //console.log(report);
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
