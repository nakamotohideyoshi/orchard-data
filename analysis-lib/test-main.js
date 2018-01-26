let analysisLibModule = require('./analysis-lib-module');
let argv = require('minimist')(process.argv.slice(2));

// Filter string
let filterRegex = /(filter)[0-9]+/i;
let filterId = argv['filter'] || 1;
let filter = filterRegex.test(filterId) ? filterId : `filter${filterId}`;

if(!argv['filter']) { console.log('\n ***** No filterId specified. Using "filter1" *****\n'); }

let datasetId = argv['datasetId'] || '11-rows.tsv';
if(!argv['datasetId']) { console.log('\n ***** No datasetId specified. Using "11-rows.tsv" *****\n'); }

let dbName = argv['dbName'] || 'analysis-lib';
if(!argv['dbName']) { console.log('\n ***** No dbName specified. Using "analysis-lib" *****\n'); }

analysisLibModule.main(filter, dbName, datasetId);
