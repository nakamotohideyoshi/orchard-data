let analysisLibModule = require('../analysis-lib-module')
let argv = require('minimist')(process.argv.slice(2))

let datasetId = argv['dataset'] || 1
let status = argv['status'] || 1

let dbInterface = new analysisLibModule.DbInterface()
dbInterface.init()

dbInterface.updateDatasetStatus(datasetId, status)
