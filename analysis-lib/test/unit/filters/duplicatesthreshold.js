const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const filterId = 'duplicatesthreshold'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should pass when duplicates ratio is lower than the threshold', () => {
    let result = filter(mocks.shouldPassWhenDuplicatesRatioIsLowerThanTheThreshold)
    assert.equal(result.duplicatesRatio, 0.1)
    assert.equal(result.numberOfDuplicates, 10)
    assert.equal(result.exceeded, false)
  })

  it('should fail when duplicates ratio is equal to the threshold', () => {
    let result = filter(mocks.shouldFailWhenDuplicatesRatioIsEqualToTheThreshold)
    assert.equal(result.duplicatesRatio, 0.1)
    assert.equal(result.numberOfDuplicates, 10)
    assert.equal(result.exceeded, true)
  })

  it('should fail when duplicates ratio is greater than the threshold', () => {
    let result = filter(mocks.shouldFailWhenDuplicatesRatioIsGreaterThanTheThreshold)
    assert.equal(result.duplicatesRatio, 0.1)
    assert.equal(result.numberOfDuplicates, 10)
    assert.equal(result.exceeded, true)
  })
})
