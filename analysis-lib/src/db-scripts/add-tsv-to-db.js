module.exports = function(inputPath, dbName) {

  let dbInfo = require('./db-info');
  let dbInterfaceModule = require('./db-interface-module');
  let loadTsv = require('../scripts/load-tsv');
  let Promise = require('bluebird').Promise;
  let sqlite = require('sqlite');

  // DB Variables
  let dbPath = dbInfo[dbName].path.concat(dbInfo[dbName].name).join("/");

  // The table to add the TSV Files
  let orchardTable = dbInfo[dbName]['tables']['orchard_dataset_contents'];

  // Instantiate interface
  let dbInterface = new dbInterfaceModule();
  dbInterface.loadDB(dbPath);

  try {

    let dbPromise = Promise.resolve()
    .then(() => sqlite.open(dbPath, { Promise }))
    .then(db => {

      // Saves row by row on the newly created table
      loadTsv(inputPath)
      .on('data', function(row) {

        let values = [inputPath.split('/').reverse()[0]];

        Object.keys(row).forEach(key => values.push(row[key]));
        dbInterface.insertRowOnTable(values, orchardTable['name']);

      });

    });

  }

  catch (err) {

    next(err);

  }

}
