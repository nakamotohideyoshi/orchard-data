const assert = require('chai').assert
const _ = require('lodash')

const filterId = 'filter1'

const mocks = require(`../../../mocks/filters/${filterId}`)

const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}`, () => {
  const report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('validates occurrences fields', () => {
    const mock = mocks['variousArtists']

    mock.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

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

  it('should report - string various artists appear on track level', () => {
    const mock = mocks['variousArtists']

    mock.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Various Artists'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  it('should report - string various artists appear on track level with diacritics', () => {
    const mock = mocks['diacritics']

    mock.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Várious Ártísts'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  it('should report - string various artists appear on track level in portuguese', () => {
    const mock = mocks['portuguese']

    mock.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

      assert.deepEqual(occurrence.field, ['track_artist'])

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.value, ['Vários Artistas'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.value, ['Vários Intérpretes'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - various artists abbreviations appear on track level', () => {
    const mock = mocks['abbreviations']

    mock.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

      assert.deepEqual(occurrence.field, ['track_artist'])

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.value, ['V.A'])
          assert.deepEqual(occurrence.explanation_id, ['abbreviation'])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.value, ['v.a.'])
          assert.deepEqual(occurrence.explanation_id, ['abbreviation'])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 2:
          assert.deepEqual(occurrence.value, ['VA'])
          break
      }
    })
  })

  it('should not report - various artists does not appear on track level', () => {
    const mock = mocks['valid']

    mock.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence, false)
    })
  })
})
