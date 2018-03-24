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
  const report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('validates occurrences fields', () => {
    const { invalid } = mocks

    invalid.forEach((row, idx) => {
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

  it('should report - invalid keywords occur on artists fields', () => {
    const { invalid } = mocks

    invalid.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
          assert.deepEqual(occurrence.value, ['Yoga'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 1:
          assert.deepEqual(occurrence.field, ['orchard_artist', 'release_artists_primary_artist'])
          assert.deepEqual(occurrence.value, ['Christmas', 'Yoga'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType])

          break

        case 2:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Top Hits'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 3:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Chorus'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 4:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Orchestra'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 5:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Singer'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 6:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Meditation'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 7:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Baby'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 8:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Workout'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  // Valid test should return false
  it('should not report - invalid keywords do not occur ', () => {
    const { valid } = mocks

    valid.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  it('should report - invalid portuguese keywords occur on artists fields', () => {
    const { invalidPortuguese } = mocks

    invalidPortuguese.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)

      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
          assert.deepEqual(occurrence.value, ['Yoga'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 1:
          assert.deepEqual(occurrence.field, ['orchard_artist', 'release_artists_primary_artist'])
          assert.deepEqual(occurrence.value, ['Natal', 'Yoga'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType])

          break

        case 2:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Melhores Hits'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 3:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Coral'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 4:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Orquestra'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 5:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Cantor'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 6:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Meditação'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 7:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Cantora'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break

        case 8:
          assert.deepEqual(occurrence.field, ['orchard_artist'])
          assert.deepEqual(occurrence.value, ['Malhação'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  // Valid test should return false
  it('should not report - invalid portuguese keywords do not occur', () => {
    const { validPortuguese } = mocks

    validPortuguese.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })

  // Valid test should return false
  it('should not report - language not supported', () => {
    const { invalidLanguage } = mocks

    invalidLanguage.forEach((row, idx) => {
      const occurrence = filter(row, idx, report)
      assert.equal(occurrence, false)
    })
  })
})
