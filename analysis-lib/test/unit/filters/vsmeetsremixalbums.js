const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = require('path').parse(__filename).name
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should pass: everything is fine', () => {
    let mock = mocks.shouldPass1
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })

  it('should pass: no errors in the dataset', () => {
    let mock = mocks.shouldPass2
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })

  it('should fail: original artists (whose songs are being remixed) identified at album level as Remixer', () => {
    let mock = mocks.shouldFail3
    let occurrences = filter(mock.dataset)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_remixer'])
      assert.deepEqual(occurrence.value, ['Tortoise'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: original artists (whose songs are being remixed) NOT listed at the track level', () => {
    let mock = mocks.shouldFail4
    let occurrences = filter(mock.dataset)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist', 'release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['Derrick Carter', 'Derrick Carter'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType])
    })
  })

  it('should fail: mixing DJ not listed at the album level identified as primary artist', () => {
    let mock = mocks.shouldFail5
    let occurrences = filter(mock.dataset)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['Tortoise'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
})
