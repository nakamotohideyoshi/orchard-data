const assert = require('chai').assert
const _ = require('lodash')

const filterId = require('path').parse(__filename).name

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
    const mock = mocks['invalid']

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

  // Valid
  it('should not report - flagged type does not occur', () => {
    const mock = mocks['valid']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (idx) {
        case 0:
          assert.equal(occurrence, false)
          break
      }
    })
  })

  // Valid
  it('should not report - flagged type occurs but genre is valid', () => {
    const mock = mocks['validGenre']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (idx) {
        case 0:
          assert.equal(occurrence, false)
          break
      }
    })
  })

  // Invalid value inside brackets
  it('should report - flagged type occurs separated by periods', () => {
    const mock = mocks['invalidPeriod']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Space Jam (O.S.T.)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  // invalidScore
  it('should report - flagged type occurs on flagged genres', () => {
    const mock = mocks['invalid']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.value, ['Space Jam (OST)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.value, ['Space Jam (OST)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 2:
          assert.deepEqual(occurrence.value, ['Space Jam (OST)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 3:
          assert.deepEqual(occurrence.value, ['Space Jam (OST)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 4:
          assert.deepEqual(occurrence.value, ['Space Jam (OST)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 5:
          assert.deepEqual(occurrence.value, ['Space Jam (OST)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })
})
