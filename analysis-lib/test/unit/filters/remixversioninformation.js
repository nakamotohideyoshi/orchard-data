const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = require('path').parse(__filename).name
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should pass - everything ok', () => {
    let mock = mocks.passEverythingOk
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 0)
  })

  it('should fail - hyphen delimiter', () => {
    let mock = mocks.failHyphenDelimiter
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 1'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - tail begins with square brackets', () => {
    let mock = mocks.failTailBeginsWithSquareBrackets
    let occurrences = filter(mock)

    assert.equal(occurrences.length, 2)

    assert.deepEqual(occurrences[0].field, ['release_name', 'track_name'])
    assert.deepEqual(occurrences[0].value, ['Consectetur 3', 'Lorem Ipsum [remix 1]'])
    assert.deepEqual(occurrences[0].explanation_id, [defaultExplanationId, defaultExplanationId])
    assert.deepEqual(occurrences[0].error_type, [defaultErrorType, defaultErrorType])

    assert.deepEqual(occurrences[1].field, ['release_name', 'track_name'])
    assert.deepEqual(occurrences[1].value, ['Consectetur 3', 'Lorem Ipsum [remix 2]'])
    assert.deepEqual(occurrences[1].explanation_id, [defaultExplanationId, defaultExplanationId])
    assert.deepEqual(occurrences[1].error_type, [defaultErrorType, defaultErrorType])
  })

  it('should fail - tail begins with paren', () => {
    let mock = mocks.failTailBeginsWithParen
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 4'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass - there is no tail', () => {
    let mock = mocks.passThereIsNoTail
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 0)
  })

  it('should fail - value is "remix"', () => {
    let mock = mocks.failValueIsRemix
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 6'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - value is "mix"', () => {
    let mock = mocks.failValueIsMix
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 7'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - value is "remixed"', () => {
    let mock = mocks.failValueIsRemixed
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 8'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - value is "mixed"', () => {
    let mock = mocks.failValueIsMixed
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 8'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass - flag value is not delimited by word separators before', () => {
    let mock = mocks.passFlagValueIsNotDelimitedByWordSeparatorsBefore
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 0)
  })

  it('should pass - flag value is not delimited by word separators after', () => {
    let mock = mocks.passFlagValueIsNotDelimitedByWordSeparatorsAfter
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 0)
  })

  it('should fail - flag value is in parens', () => {
    let mock = mocks.failFlagValueIsInParens
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 11'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - flag value is in square brackets', () => {
    let mock = mocks.failFlagValueIsInSquareBrackets
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 12'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - flag value is MiX case', () => {
    let mock = mocks.failFlagValueIsMiXCase
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 13'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - track remixer has a value', () => {
    let mock = mocks.failTrackRemixerHasAValue
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 14'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - non-remix is the original song', () => {
    let mock = mocks.failNonRemixIsTheOriginalSong
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 3)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 15'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - original song has parens', () => {
    let mock = mocks.failOriginalSongHasParens
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 3)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Consectetur 16'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail - identical track titles', () => {
    let mock = mocks.failIdenticalTrackTitles
    let occurrences = filter(mock)
    assert.equal(occurrences.length, 2)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_name'])
      assert.deepEqual(occurrence.value, ['Lorem Ipsum'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
})
