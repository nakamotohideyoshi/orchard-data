module.exports = function() {

  let sqlite3 = require('sqlite3').verbose();
  let sqlite = require('sqlite');
  let dbInfo = require('./db-info');
  let readTsv = require('../scripts/read-tsv');
  let DATABASE = require('../scripts/constants').DATABASE;

  // stores db path
  this.init = function() {

    this.dbPath = dbInfo[DATABASE].path.concat(dbInfo[DATABASE].name).join("/");

  };

  // Loads TSV File into DATABASE
  this.saveTsvIntoDB = function(inputPath) {

    // The table to add the TSV Files
    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents'];

    try {

      let dbPromise = Promise.resolve()
        .then(() => sqlite.open(this.dbPath, { Promise }))
        .then(db => {

          // Saves row by row on the newly created table
          readTsv(inputPath)
            .on('data', function(row) {

              let values = [inputPath.split('/').reverse()[0]];
              Object.keys(row).forEach(key => values.push(row[key]));

              let placeholders = values.map((val) => '(?)').join(',');
              let stmt = `INSERT INTO ${orchardTable.name} VALUES (${placeholders})`;

              db.run(stmt, values)
                .then((result) => {
                  console.log(`Rows inserted: ${result.changes}`);
                },
                (err) => { console.log(err); }
              );

            });

        });

    }

    catch (err) {

      next(err);

    }

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

          db.run(stmt, values)
            .then((result) => {
                console.log(`Rows inserted: ${result.changes}`);
              },
              (err) => { console.log(err); }
            );

      });

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
  this.saveFieldByFieldReport = function(report, filterId) {

    var reportTable = dbInfo[DATABASE]['tables']['field_by_field_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {

        report.forEach(row => {

          let placeholders = row.map((val) => '(?)').join(',');
          let stmt = `INSERT INTO ${reportTable.name} VALUES (${placeholders})`;

          db.run(stmt, row)
            .then((result) => {
              console.log(`Rows inserted: ${result.changes}`);
            },
              (err) => { console.log(err); }
            );

        });

    });

  };

  this.fetchFieldByFieldReport = function() {

    let FBFReportTable = dbInfo[DATABASE]['tables']['field_by_field_reports'];

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT * FROM ${FBFReportTable.name}`));

    return dbPromise;

  };

};
