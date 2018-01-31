let ALM = require('../analysis-lib-module');
let Promise = require('bluebird');
// let argv = require('minimist')(process.argv.slice(2));

let dbInterface = new ALM.DbInterface();
dbInterface.init();

let tablesInfo = ALM.dbInfo[ALM.constants.DATABASE]['tables']
let tables = Object.keys(tablesInfo).map(table => tablesInfo[table].name);

Promise.map(tables, (table) => dbInterface.clearTable(table));
