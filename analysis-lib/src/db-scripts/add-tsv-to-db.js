let dbInfo = require('./db-info');
let dbInterfaceModule = require('./db-interface-module');
let argv = require('minimist')(process.argv.slice(2));
let loadTsv = require('../scripts/load-tsv');
let Promise = require('bluebird').Promise;
let sqlite = require('sqlite');

// Throws exception if input was not specified
if(!argv['input']) { throw('Input file not specified'); }

// Parses input location
let inputDir = ['data-tests', 'input-files'];
let inputFile = argv['input'];
let inputPath = inputDir.concat(inputFile).join('/');

// DB Variables
let dbName = 'analysis-lib';
let dbPath = dbInfo[dbName].path.concat(dbInfo[dbName].name).join("/");

// The table to add the TSV Files
let tableName = dbInfo[dbName]['tables']['tsv_files'].name;

// Instantiate interface
let dbInterface = new dbInterfaceModule();
dbInterface.loadDB(dbPath);

// Wrapper to create a new orchard table
let createOrchardTable = function(tsvTableName) {

  let query = `CREATE TABLE IF NOT EXISTS ${tsvTableName} (dataset_id
                 foreign_key, release_name text, release_meta_language
                 text, orchard_artist text, artist_country text,
                 subaccount_name text, artist_url text,
                 release_artists_primary_artist text,
                 release_artists_featuring text, release_artists_remixer
                 text, release_artists_composer text,
                 release_artists_orchestra text, release_artists_ensemble
                 text, release_artists_conductor text, release_date text,
                 sale_start_date text, itunes_preorder text,
                 itunes_preorder_date text, preorder_preview text,
                 release_itunes_pricing text, release_amazon_pricing
                 text, format text, imprint text, genre text, sub_genre
                 text, copyright_information text, digital_upc text,
                 manufacturers_upc text, label_catalog_number text,
                 release_version text, file_name text, volume text,
                 track_no text, track_name text, meta_language text,
                 version text, track_artist text, track_artist_featuring
                 text, track_artist_remixer text, track_artist_composer
                 text, track_artist_orchestra text, track_artist_ensemble
                 text, track_artist_conductor text, track_itunes_pricing
                 text, track_amazon_pricing text, explicit text, isrc
                 text, third_party_publisher text, p_information text,
                 songwriters text, publishers text, only_include_exclude
                 text, territories text)`

  dbInterface.DB().run(query);

  console.log(`Created Table ${tsvTableName} on database ${dbInterface.getDatabaseName()}`);

};

try {

  let db;
  let noOfFiles;
  let tsvTableName = 'orchard_dataset_contents_';

  let dbPromise = Promise.resolve()
    .then(() => sqlite.open(dbPath, { Promise }))
    .then(database => {
      // stashes this promise for further use
      db = database;
      return db;
    })
    .then(() => db.get(`SELECT COUNT(*) FROM (SELECT * FROM ${tableName})`))
    .then(count => noOfFiles = count['COUNT(*)'] + 1)
    .then(() => tsvTableName += noOfFiles.toString())
    .then(() => createOrchardTable(tsvTableName))
    .then(() => dbInterface.insertRowOnTable([inputFile, tsvTableName], tableName))
    .then(() => {

      // Saves row by row on the newly created table
      loadTsv(inputPath)
        .on('data', function(row) {

          let values = [noOfFiles];
          Object.keys(row).forEach(key => values.push(row[key]));

          dbInterface.insertRowOnTable(values, tsvTableName);

        });

    });

}

catch (err) {

  next(err);

}
