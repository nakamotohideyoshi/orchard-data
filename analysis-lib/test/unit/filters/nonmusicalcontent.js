const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = 'nonmusicalcontent'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: genre in non-musical list', () => {
    mocks.shouldFailGenreInNonMusicalList.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['genre'])
      assert.deepEqual(occurrence.value, ['Anime'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: sub-genre in non-musical list', () => {
    mocks.shouldFailSubGenreInNonMusicalList.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['sub_genre'])
      assert.deepEqual(occurrence.value, ['Stories'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass: both genre and sub-genre in non-musical list', () => {
    mocks.shouldPassBothGenreAndSubGenreInNonMusicalList.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should fail: genre in non-musical list (case-insensitive match)', () => {
    mocks.shouldFailGenreInNonMusicalListCaseInsensitiveMatch.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['genre'])
      assert.deepEqual(occurrence.value, ['ANIME'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: genre in non-musical list, computer-friendly column', () => {
    mocks.shouldFailGenreInNonMusicalListComputerFriendlyColumn.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['genre'])
      assert.deepEqual(occurrence.value, ['STANDUP-COMEDY-00'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: genre in non-musical list, computer-friendly column, case-insensitive match', () => {
    mocks.shouldFailGenreInNonMusicalListComputerFriendlyColumnCaseInsensitiveMatch.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['sub_genre'])
      assert.deepEqual(occurrence.value, ['standup-comedy-00'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
})
