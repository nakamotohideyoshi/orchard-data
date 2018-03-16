const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = 'filter18'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should pass: no rules were broken', () => {
    mocks.validTracks.forEach((item, index) => {
      let occurrence = filter(item, index, mocks.validTracks)
      assert.equal(occurrence, false)
    })
  })

  it('should fail: the following terms occur (with a case-insensitive match) in a release name or track title: "(Explicit)", "(Clean)"', () => {
    mocks.releaseNameOrTrackTitleContainingFlag.forEach((item, index) => {
      let occurrence = filter(item, index, mocks.releaseNameOrTrackTitleContainingFlag)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Lorem Ipsum Dolor (Explicit)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        case 1:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['Sit Asmet Vacum (Explicit)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        case 2:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Lorem Ipsum Dolor (Clean)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        case 3:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['Sit Asmet Vacum (Clean)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        case 4:
          assert.deepEqual(occurrence.field, ['release_name', 'track_name'])
          assert.deepEqual(occurrence.value, ['Lorem Ipsum Dolor (Clean)', 'Sit Asmet Vacum (Explicit)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType])
          break
      }
    })
  })

  it('should fail: there is a track flagged clean and there is not an identical track marked explicit', () => {
    mocks.tracksFlaggedCleanWithoutIdenticalMarkedExplicit.forEach((item, index) => {
      let occurrence = filter(item, index, mocks.tracksFlaggedCleanWithoutIdenticalMarkedExplicit)

      switch (index) {
        case 0:
        case 1:
          assert.deepEqual(occurrence.field, ['explicit'])
          assert.deepEqual(occurrence.value, ['clean'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        default:
          assert.equal(occurrence, false)
          break
      }
    })
  })
})
