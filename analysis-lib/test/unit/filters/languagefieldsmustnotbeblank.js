const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = require('path').parse(__filename).name
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const [
  defaultExplanationId,
  nonLinguisticContentExplanationId
] = Object.keys(filterMeta.explanations)

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: Release Meta Language blank', () => {
    mocks.shouldFailReleaseMetaLanguageBlank.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_meta_language'])
      assert.deepEqual(occurrence.value, [''])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Meta Language blank', () => {
    mocks.shouldFailMetaLanguageBlank.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['meta_language'])
      assert.deepEqual(occurrence.value, [''])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Meta Language contains only whitespace', () => {
    mocks.shouldFailReleaseMetaLanguageContainsOnlyWhitespace.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_meta_language'])
      assert.deepEqual(occurrence.value, ['     '])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass: Genre is non-music and Meta Language is zxx', () => {
    mocks.shouldPassGenreIsNonMusicAndMetaLanguageIsZxx.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should fail: Genre is non-music and Meta Language is not zxx', () => {
    mocks.shouldFailGenreIsNonMusicAndMetaLanguageIsNotZxx.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['meta_language'])
      assert.deepEqual(occurrence.value, ['English'])
      assert.deepEqual(occurrence.explanation_id, [nonLinguisticContentExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
})
