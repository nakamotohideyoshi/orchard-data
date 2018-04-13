const assert = require('chai').assert
const _ = require('lodash')
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = 'trackcountthreshold'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, function () {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: Too many tracks in this album. The most is 14', async () => {
    let mock = mocks.albumWithTooManyTracks
    let metadata = mocks.metadata

    const occurrences = filter(mock, metadata)

    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.row_id, 15)
          assert.deepEqual(occurrence.field, ['track_no'])
          assert.deepEqual(occurrence.value, ['15'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should pass: The most is 15', async () => {
    let mock = mocks.albumWithTooManyTracks
    let metadata = mocks.metadata1

    const occurrences = filter(mock, metadata)
    assert.equal(_.isEmpty(occurrences), true)
  })
})
