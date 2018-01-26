let ALM = require('../analysis-lib-module');
// let argv = require('minimist')(process.argv.slice(2));

let dbInterface = new ALM.dbInterface();
dbInterface.init();

let tables = ['orchard_dataset_contents', 'field_by_field_reports'];

tables.forEach(table => dbInterface.clearTable(table));
