const argv = require('minimist')(process.argv.splice(2))

if (!argv['filter']) { throw Error('No filter specified') }
if (!argv['sample']) { throw Error('No sample specified') }

const path = require('path')
const filtersModule = require('require-all')(path.join(__dirname, '/../src/filters'))
const filter = argv['filter']

const mocks = require(`../mocks/filters/${filter}`)
let mock = mocks[argv['sample']]

const DbInterfaceModule = require('../src/db-scripts/db-interface.js')
const dbInterface = new DbInterfaceModule()
dbInterface.init()
const metadata = dbInterface.fetchDatasetMetaRow(0)

let _report = []

if (mock.hasOwnProperty('dataset')) {
  mock = mock.dataset
}

mock.forEach((row, idx) => _report.push(filtersModule[filter](row, idx, metadata)))

console.log(_report)
