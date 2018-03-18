let ALM = require('../analysis-lib-module')
let argv = require('minimist')(process.argv.slice(2))

let dbInterface = new ALM.DbInterface()
dbInterface.init()

let table = argv['table'] || 'orchard_dataset_contents'
dbInterface.clearTable(table)
