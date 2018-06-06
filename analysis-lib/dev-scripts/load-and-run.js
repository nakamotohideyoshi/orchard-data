let analysisLibModule = require('../analysis-lib-module')
let argv = require('minimist')(process.argv.slice(2))

let inputDir = ['data-tests', 'input-files']
let inputFile = argv['input'] || '11-rows.tsv'
let inputPath = inputDir.concat(inputFile).join('/')
if (!argv['input']) { console.log('\n ***** No input specified. Using "11-rows.tsv *****\n"') }

let data = {
  'source': inputPath,
  'artist_blacklist': 'artist_blacklist',
  'keyword_blacklist': 'keyword_blacklist',
  'duplicates_threshold': 'duplicates_threshold',
  'various_artists_threshold': 'various_artists_threshold',
  'lang': 'en_GB',
  'time': Date.now()
}
let datasetId
let report

let dbInterface = new analysisLibModule.DbInterface()
dbInterface.init()

console.log('BP ##', 2, data)
let dbPromise = dbInterface.saveDatasetMeta(data)
dbPromise
  .then(result => {
    datasetId = result.lastID
    console.log('BP ##', 1, datasetId)
    return dbInterface.saveTsvIntoDB(data.source, datasetId)
  })
  .then(() => analysisLibModule.runAllFilters(datasetId))
  .then(rep => {
    report = rep
    return report.calcFieldByFieldReportAll(datasetId)
  })
  .then(() => dbInterface.saveFieldByFieldReport(report.FBFReport))
  .then(() => report.calcBatchResultsReport())
  .then(() => dbInterface.saveBatchResultsReport(report.BRReport))
/// / .then(() => dbInterface.fetchBatchResultsReport())
/// / .then(report => console.log(report));
