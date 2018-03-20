const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const filterId = 'albummatchesartist'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: it is an error for release name to be the same as artist name', () => {
    mocks.shouldFailItIsAnErrorForReleaseNameToBeTheSameAsArtistName.dataset.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Invaders Must Die'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass: matching artist name is in "featuring" column', () => {
    mocks.shouldPassMatchingArtistNameIsInFeaturingColumn.dataset.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should pass: matching artist name is in track artist column', () => {
    mocks.shouldPassMatchingArtistNameIsInTrackArtistColumn.dataset.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should fail: the string match is case-insensitive', () => {
    mocks.shouldFailTheStringMatchIsCaseInsensitive.dataset.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Invaders Must Die'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass: a substring match is not an error', () => {
    mocks.shouldPassASubstringMatchIsNotAnError.dataset.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })
})
