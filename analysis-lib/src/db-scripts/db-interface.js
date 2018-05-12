/* eslint prefer-promise-reject-errors: off */

'use strict'

module.exports = function () {
  let sqlite = require('sqlite')
  let Promise = require('bluebird')
  let _ = require('lodash')
  let dbInfo = require('./db-info')
  let IO = require('../scripts/IO-module')
  let DATABASE = require('../scripts/constants').DATABASE
  let filtersMeta = require('../filters/filters-meta')

  let readTsv = new IO().readTsv

  // stores db path
  this.init = function () {
    this.dbPath = dbInfo[DATABASE].path.concat(dbInfo[DATABASE].name).join('/')

    this.dbStatus = {
      'OK': 1,
      'FAIL': 2,
      'INPROGRESS': 3
    }
  }

  // Loads TSV File into DATABASE
  this.saveTsvIntoDB = function (inputPath, datasetId) {
    // The table to add the TSV Files
    const orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']
    const fieldsDict = orchardTable['columns_dict']
    let tsvFile
    const warnings = []

    const dbPromise = readTsv(inputPath)
      .then(file => { tsvFile = file })
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {
        // Raw Fields
        const tsvFields = Object.keys(tsvFile[0])
        const numberOfFields = tsvFields.length

        // Filters are maped to datavase columns
        const fields = ['dataset_id']

        Object.keys(tsvFile[0]).forEach(key => {
          if (key in fieldsDict) { fields.push(fieldsDict[key]) } else { warnings.push(`Field "${key}" does not exist on ${orchardTable.name}'s columns_dict`) }
        })

        // Checks if TSV has missing or extra fields
        console.log('***** Checking Number of Fields *****\n')
        if (numberOfFields < 52 || numberOfFields > 53) {
          console.log('Field count error when trying to upload TSV', numberOfFields, '\n')

          return Promise.reject({
            'thrower': 'saveTsvIntoDB',
            'row_id': -1,
            'error': new Error(`Invalid number of fields: ${numberOfFields}`)
          })
        }

        // Checks if some field is undefined
        /*
        console.log("***** Checking for undefined fields *****\n");
        let offset = numberOfFields == 52 ? 0 : 1;
        for(let i = offset; i < fields.length; i++) {

          let field = fields[i];

          if(typeof(field) === 'undefined') {

            return Promise.reject({
              "thrower": "saveTsvIntoDB",
              "row_id": -1,
              "error": new Error(`Field "${tsvFields[i - 1]}" does not exist under table ${orchardTable.name} columns. Check db-info.js file.`)
            });

          }

        }
        */

        return Promise.map(tsvFile, (row, idx) => {
          const values = [datasetId]
          tsvFields.forEach(key => {
            if (key in fieldsDict) { values.push(row[key]) }
          })

          const placeholders = values.map(() => '(?)').join(',')
          const stmt = `INSERT INTO ${orchardTable.name}(${fields}) VALUES (${placeholders})`

          return db.run(stmt, values)
            .then(() => {
              return Promise.resolve('OK')
            },
            (err) => {
              return new Promise(function (resolve, reject) {
                resolve({
                  'thrower': 'saveTsvIntoDB',
                  'row_id': idx,
                  'error': new Error(err),
                  'status': 'ERROR'
                })
                reject(new Error(err))
              })
            })
        })
      })
      .then(() => Promise.resolve({ 'status': 'OK', 'warnings': warnings }))

    return dbPromise
  }

  this.logErrorIntoDB = function (datasetId, error) {
    // The table to add the TSV Files
    let logsTable = dbInfo[DATABASE]['tables']['tsv_logs_table']

    // Opens a new connection or uses an existing one
    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {
        let fields = ['dataset_id', 'row_id', 'message']
        let values = [datasetId, error['row_id'], error['message'].toString()]

        let placeholders = values.map(() => '(?)').join(',')
        let stmt = `INSERT INTO ${logsTable.name}(${fields}) VALUES (${placeholders})`

        return db.run(stmt, values)
          .then(() => {
            return Promise.resolve('OK')
          },
          (err) => {
            return Promise.reject(err)
          }
          )
      })
      .then(() => Promise.resolve({ 'status': 'OK' }))

    return dbPromise
  }

  // gets the number of lines of give dataset
  this.getDatasetSize = function (datasetId) {
    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT COUNT(*) FROM ${orchardTable.name} WHERE dataset_id = '${datasetId}'`))
      .then(result => Promise.resolve(result[0]['COUNT(*)']))

    return dbPromise
  }

  // update DataSet Status as success (1) or failed (2) or in-progress (3)
  this.updateDatasetStatus = function (datasetId, status) {
    console.log(`***** Updating dataset status: ${status} *****\n`)

    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {
        return db.run(`
          UPDATE ${datasetMetaTable.name}
          SET status = ${status}
          WHERE rowId = ${datasetId}
        `)
          .then(() => { return Promise.resolve({'status': 'OK', 'datasetStatus': status}) },
            (err) => {
              return new Promise(function (resolve, reject) {
                resolve({
                  'row_id': -1,
                  'error': new Error(err)
                })
                reject(new Error(err))
              })
            })
      })

    return dbPromise
  }

  this.saveDatasetMeta = function (metadata) {
    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta']

    try {
      let dbPromise = readTsv(metadata.source)
        .then(() => sqlite.open(this.dbPath, { Promise }))
        .then(db => {
          let values = []

          Object.keys(metadata).forEach(key => values.push(metadata[key]))

          let placeholders = values.map(() => '(?)').join(',')
          let fields = Object.keys(metadata)

          let stmt = `INSERT INTO ${datasetMetaTable.name} (${fields}) VALUES (${placeholders})`

          return db.run(stmt, values)
            .then(result => ({ 'datasetId': result.lastID }), (err) => err)
        })

      return dbPromise
    } catch (err) {
      return Promise.reject(err)
    }
  }

  this.fetchDatasetMeta = function () {
    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${datasetMetaTable.name}`))

    return dbPromise
  }

  this.deleteDatasetMetaRow = function (rowId) {
    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta']
    let reportTable = dbInfo[DATABASE]['tables']['field_by_field_reports']
    let batchResultsTable = dbInfo[DATABASE]['tables']['batch_results_reports']
    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']
    let logsTable = dbInfo[DATABASE]['tables']['tsv_logs_table']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then((db) => {
        // delete dataset meta and all related data across other tables
        return Promise.all([
          db.all(`DELETE FROM ${datasetMetaTable.name} WHERE rowId = ${rowId}`),
          db.all(`DELETE FROM ${reportTable.name} WHERE dataset_id = ${rowId}`),
          db.all(`DELETE FROM ${batchResultsTable.name} WHERE dataset_id = ${rowId}`),
          db.all(`DELETE FROM ${orchardTable.name} WHERE dataset_id = ${rowId}`),
          db.all(`DELETE FROM ${logsTable.name} WHERE dataset_id = ${rowId}`)
        ])
          .then(() => {})
      })

    return dbPromise
  }

  this.fetchDatasetMetaRow = function (rowId) {
    let datasetMetaTable = dbInfo[DATABASE]['tables']['dataset_meta']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${datasetMetaTable.name} WHERE rowId = ${rowId}`))

    return dbPromise
  }

  // Clears a table - DEV only
  this.clearTable = function (tableName) {
    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.run(`DELETE FROM ${tableName}`))

    return dbPromise
  }

  // Returns rows with given datasetId from the orchard table
  this.fetchTsvDataset = function (datasetId) {
    let orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT * FROM ${orchardTable.name} WHERE dataset_id = '${datasetId}'`))

    return dbPromise
  }

  this.datasetColumnsDictionary = function () {
    const orchardTable = dbInfo[DATABASE]['tables']['orchard_dataset_contents']
    const fieldsDict = orchardTable['columns_dict']

    return _.invert(fieldsDict)
  }

  // Save field by field report
  this.saveFieldByFieldReport = function (report) {
    // console.log(report);
    var reportTable = dbInfo[DATABASE]['tables']['field_by_field_reports']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {
        return Promise.map(report, (row) => {
          let columns = Object.keys(row)
          let values = columns.map((val) => row[val])
          let placeholders = columns.map(() => '(?)').join(',')
          let stmt = `INSERT INTO ${reportTable.name}(${columns}) VALUES (${placeholders})`

          return db.run(stmt, values)
            .then((result) => {
              console.log(`Rows inserted: ${result.changes}`)
            },
            (err) => { console.log(err) }
            )
        })
      })

    return dbPromise
  }

  // Save field by field report
  this.saveBatchResultsReport = function (report) {
    var reportTable = dbInfo[DATABASE]['tables']['batch_results_reports']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => {
        let columns = Object.keys(report)
        let placeholders = columns.map(() => '(?)').join(',')
        let stmt = `INSERT INTO ${reportTable.name}(${columns}) VALUES(${placeholders})`
        let values = Object.keys(report).map(key => report[key])
        return db.run(stmt, values)
          .then((result) => {
            console.log(`Rows inserted: ${result.changes}`)
          },
          (err) => { console.log(err) }
          )
      })

    return dbPromise
  }

  this.fetchFieldByFieldReport = function (datasetId, category) {
    let FBFReportTable = dbInfo[DATABASE]['tables']['field_by_field_reports']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))

    // Returns all rows
    if (!category) {
      return dbPromise
        .then(db => db.all(`
          SELECT rowId, *
          FROM ${FBFReportTable.name}
          WHERE dataset_id = ${datasetId}
          ORDER BY test_data_row_id ASC
        `))
    } else {
      let filters = Object.keys(filtersMeta).filter(filterId => filtersMeta[filterId]['category'].toLowerCase() === category)
      let placeholders = filters.map(() => '(?)').join(',')

      return dbPromise
        .then(db => db.all(`
          SELECT rowId, *
          FROM ${FBFReportTable.name}
          WHERE dataset_id = ${datasetId}
          AND criteria_id IN (${placeholders})
          ORDER BY test_data_row_id ASC
        `, filters))
    }
  }

  this.fetchAllFieldByFieldReports = function () {
    let FBFReportTable = dbInfo[DATABASE]['tables']['field_by_field_reports']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${FBFReportTable.name}`))

    return dbPromise
  }

  this.fetchBatchResultsReport = function (datasetId) {
    let reportTable = dbInfo[DATABASE]['tables']['batch_results_reports']

    let dbPromise = Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`
        SELECT rowId, *
        FROM ${reportTable.name}
        WHERE dataset_id = ${datasetId}
      `))

    return dbPromise
  }

  this.fetchAllBatchResultsReports = function () {
    let reportTable = dbInfo[DATABASE]['tables']['batch_results_reports']

    return Promise.resolve()
      .then(() => sqlite.open(this.dbPath, { Promise }))
      .then(db => db.all(`SELECT rowId, * FROM ${reportTable.name}`))
  }
}
