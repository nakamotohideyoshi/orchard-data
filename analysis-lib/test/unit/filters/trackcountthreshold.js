const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = 'trackcountthreshold'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  let numberOfTestsExpectedToPass = 6
  let dataset = mocks.albumWithTooManyTracks
  let length = dataset.length

  for (let trackCountThreshold = 0; trackCountThreshold < length; trackCountThreshold++) {
    it(`should fail when the album has ${length} tracks and the track count threshold is ${trackCountThreshold}`, () => {
      let occurrences = filter(dataset, trackCountThreshold)

      assert.isNotEmpty(occurrences)

      let trackNumberGreaterThanThreshold = trackCountThreshold + 1

      occurrences.forEach((occurrence) => {
        assert.deepEqual(occurrence.field, ['track_no'])
        assert.deepEqual(occurrence.value, [trackNumberGreaterThanThreshold.toString()])
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
        assert.deepEqual(occurrence.error_type, [defaultErrorType])

        trackNumberGreaterThanThreshold++
      })
    })
  }

  for (let trackCountThreshold = length; trackCountThreshold < length + numberOfTestsExpectedToPass; trackCountThreshold++) {
    it(`should pass when the album has ${length} tracks and the track count threshold is ${trackCountThreshold}`, () => {
      let occurrences = filter(dataset, trackCountThreshold)
      assert.isEmpty(occurrences)
    })
  }
})
