let analysisLibModule = require('./analysis-lib-module');
let argv = require('minimist')(process.argv.slice(2));

let inputDir = ['data-tests', 'input-files'];
let inputFile = argv['input'] || '11-rows.tsv';
let inputPath = inputDir.concat(inputFile).join('/');
if(!argv['input']) { console.log('\n ***** No input specified. Using "11-rows.tsv *****\n"'); }

let dbName = argv['dbName'] || 'analysis-lib';
if(!argv['dbName']) { console.log('\n ***** No dbName specified. Using "analysis-lib" *****\n'); }

analysisLibModule.loadTsv(inputPath, dbName);
