const argv = require('minimist')(process.argv.splice(2))

if (!argv['filter']) { throw Error('No filter specified') }
if (!argv['sample']) { throw Error('No sample specified') }

const filtersModule = require('../src/filters/filters-module')
const filter = 'filter' + argv['filter']

const ReportModule = require('../src/scripts/report-tool')
const report = new ReportModule()
report.init()
report.addFilter(filter)

const mocks = require(`../mocks/${filter}`)
const mock = mocks[argv['sample']]

let _report = []

mock.forEach((row, idx) => _report.push(filtersModule[filter](row, idx, report)))

console.log(_report)
