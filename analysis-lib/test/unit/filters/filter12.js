const assert = require('chai').assert
const _ = require('lodash')

const filterId = 'filter12'

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

  it('should not report - target string does not appear', () => {
    const mock = mocks['valid']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should not report - target string appears in both release/track versions', () => {
    const mock = mocks['validTrackVersion']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should not report - target string appears in both release/track names', () => {
    const mock = mocks['validTrackName']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should not report - target string appears (spanish) in both release/track versions', () => {
    const mock = mocks['validSpanish']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should not report - target string appears (portuguese) in both release/track versions', () => {
    const mock = mocks['validPortuguese']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should not report - valid unmatched parens single', () => {
    const mock = mocks['validUnmatchedParensSingle']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should not report - valid unmatched parens multiple', () => {
    const mock = mocks['validUnmatchedParensMultiple']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should report - target string does not appear on track name or version', () => {
    const mock = mocks['invalidTrackVersion']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['La Paloma'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['The Model'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 2:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, [`I'm Still Alive`])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 3:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, [`I'm Still Lively`])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - unmatched parens on track name', () => {
    const mock = mocks['invalidUnmatchedParensMultiple']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['The Model (Yay!)[Live'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['The Model (Yay!)[Live'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('validates occurrences fields', () => {
    let mock = mocks['invalidTrackVersion']

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
})
