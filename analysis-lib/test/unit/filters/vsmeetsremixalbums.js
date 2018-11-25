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
  meetsMustBeCapitalized,
  vsMustBeCapitalized,
  vsMustBeWrittenExactlyLikeThat,
  artistsMustBeIdentifiedAsPrimary
] = Object.keys(filterMeta.explanations)

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail - case of "meets"', () => {
    let mock = mocks.shouldFailCaseOfMeets
    let occurrences = filter(mock.dataset)
    occurrences.forEach(occurrence => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['A meets B'])
      assert.deepEqual(occurrence.explanation_id, [meetsMustBeCapitalized])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - case of "VS."', () => {
    let mock = mocks.shouldFailCaseOfVs
    let occurrences = filter(mock.dataset)
    occurrences.forEach(occurrence => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['C VS. D'])
      assert.deepEqual(occurrence.explanation_id, [vsMustBeCapitalized])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - dot after vs', () => {
    let mock = mocks.shouldFailDotAfterVs
    let occurrences = filter(mock.dataset)
    occurrences.forEach(occurrence => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['E vs F'])
      assert.deepEqual(occurrence.explanation_id, [
        vsMustBeWrittenExactlyLikeThat
      ])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - primary artist not part A or part B, or their concatenation, delimiter is vs.', () => {
    let mock =
      mocks.shouldFailPrimaryArtistNotPartAOrPartBOrTheirConcatenationDelimiterIsVs
    let occurrences = filter(mock.dataset)
    occurrences.forEach(occurrence => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['Does Not Match'])
      assert.deepEqual(occurrence.explanation_id, [
        artistsMustBeIdentifiedAsPrimary
      ])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass - primary artist is Part A', () => {
    let mock = mocks.shouldPassPrimaryArtistIsPartA
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })

  it('should pass - primary artist is Part B', () => {
    let mock = mocks.shouldPassPrimaryArtistIsPartB
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })

  it('should fail - primary artist not part A or part B, or their concatenation, delimiter is Meets"', () => {
    let mock =
      mocks.shouldFailPrimaryArtistNotPartAOrPartBOrTheirConcatenationDelimiterIsMeets
    let occurrences = filter(mock.dataset)
    occurrences.forEach(occurrence => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['Does Not Match'])
      assert.deepEqual(occurrence.explanation_id, [
        artistsMustBeIdentifiedAsPrimary
      ])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass - primary artist is Part A|Part B (no spaces around pipe)', () => {
    let mock = mocks.shouldPassPrimaryArtistIsPartAPartBNoSpacesAroundPipe
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })

  it('should pass - primary artist is Part A|Part B (whitespace around pipe)', () => {
    let mock = mocks.shouldPassPrimaryArtistIsPartAPartBWhitespaceAroundPipe
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })

  it('should pass - primary artist is Part B|Part A', () => {
    let mock = mocks.shouldPassPrimaryArtistIsPartBPartA
    let occurrences = filter(mock.dataset)
    assert.equal(occurrences.length, 0)
  })
})
