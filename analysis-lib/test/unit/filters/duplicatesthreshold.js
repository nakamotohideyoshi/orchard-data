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
    let occurrences = filter(mocks.shouldPassWhenDuplicatesRatioIsLowerThanTheThreshold)
    occurrences.forEach((occurrence, index) => {
      if (index >= 0 && index <= 6) {
        assert.deepEqual(occurrence.field, ['isrc'])
        assert.deepEqual(occurrence.value, ['GBCEJ7800024'])
      } else if (index >= 7 && index <= 9) {
        assert.deepEqual(occurrence.field, ['isrc'])
        assert.deepEqual(occurrence.value, ['GBCEJ0399666'])
      }
    })
  })

  it('should fail when duplicates ratio is equal to the threshold', () => {
    let occurrences = filter(mocks.shouldFailWhenDuplicatesRatioIsEqualToTheThreshold)
    occurrences.forEach((occurrence, index) => {
      if (index >= 0 && index <= 6) {
        assert.deepEqual(occurrence.field, ['isrc'])
        assert.deepEqual(occurrence.value, ['GBCEJ7800024'])
      } else if (index >= 7 && index <= 9) {
        assert.deepEqual(occurrence.field, ['isrc'])
        assert.deepEqual(occurrence.value, ['GBCEJ0399666'])
      }
    })
  })

  it('should fail when duplicates ratio is greater than the threshold', () => {
    let occurrences = filter(mocks.shouldFailWhenDuplicatesRatioIsGreaterThanTheThreshold)
    occurrences.forEach((occurrence, index) => {
      if (index >= 0 && index <= 6) {
        assert.deepEqual(occurrence.field, ['isrc'])
        assert.deepEqual(occurrence.value, ['GBCEJ7800024'])
      } else if (index >= 7 && index <= 9) {
        assert.deepEqual(occurrence.field, ['isrc'])
        assert.deepEqual(occurrence.value, ['GBCEJ0399666'])
      }
    })
  })
})
