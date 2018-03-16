const assert = require('chai').assert
const _ = require('lodash')

const filterId = 'filter4'

const mocks = require(`../../../mocks/filters/${filterId}`)

const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('validates occurrences fields', () => {
    let mock = mocks['invalidRelease']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      assert.equal(_.isObject(occurrence), true)
      assert.equal(!_.isEmpty(occurrence.field), true)
      assert.equal(!_.isEmpty(occurrence.value), true)
      assert.equal('explanation_id' in occurrence, true)
      assert.equal('error_type' in occurrence, true)
      assert.equal(occurrence.value.length, occurrence.field.length)
      assert.equal(occurrence.value.length, occurrence.explanation_id.length)
      assert.equal(occurrence.value.length, occurrence.error_type.length)
    })
  })

  it('should report - invalid release artists ', () => {
    let mock = mocks['invalidRelease']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_featuring'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 2:
          assert.deepEqual(occurrence.field, ['release_artists_remixer'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 3:
          assert.deepEqual(occurrence.field, ['release_artists_composer'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 4:
          assert.deepEqual(occurrence.field, ['release_artists_conductor'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  it('should report - invalid track artists ', () => {
    let mock = mocks['invalidTrack']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 1:
          assert.deepEqual(occurrence.field, ['track_artist_featuring'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 2:
          assert.deepEqual(occurrence.field, ['track_artist_remixer'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 3:
          assert.deepEqual(occurrence.field, ['track_artist_composer'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 4:
          assert.deepEqual(occurrence.field, ['track_artist_conductor'])
          assert.deepEqual(occurrence.value, ['Doe, John'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  it('should not report - valid values', () => {
    let mock = mocks['valid']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })
})
