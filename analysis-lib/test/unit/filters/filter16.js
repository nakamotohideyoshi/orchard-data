const assert = require('chai').assert

const filterName = require('path').parse(__filename).name

const datasets = require(`../../../mocks/filters/${filterName}`)

const filter = require(`../../../src/filters/${filterName}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'
const inconsistentExplanationId = 'inconsistent'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterName}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterName)

  it('Pass English (example from style guide) 1', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide1
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Fail English (last word in parens not cap)', () => {
    const mock = datasets.failEnglishLastWordInParensNotCap
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['(You Make Me Feel Like a) Natural Woman'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English (last word in title not cap)', () => {
    const mock = datasets.failEnglishLastWordInTitleNotCap
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['I Got The - single'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English ("And" should be lower)', () => {
    const mock = datasets.failEnglishAndShouldBeLower
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['Me And You'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English ("YOu" has cap after first letter)', () => {
    const mock = datasets.failEnglishYOuHasCapAfterFirstLetter
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['Me and YOu'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Pass English (example from style guide) 2', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide2
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 3', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide3
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 4', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide4
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 5', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide5
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 6', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide6
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 7', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide7
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 8', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide8
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 9', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide9
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 10', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide10
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 11', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide11
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 12', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide12
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 13', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide13
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 14', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide14
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 15', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide15
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) 16', () => {
    const mock = datasets.passEnglishExampleFromStyleGuide16
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) (False positive) 1', () => {
    const mock = datasets.passEnglishExampleFromStyleGuideFalsePositive1
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) (False positive) 2', () => {
    const mock = datasets.passEnglishExampleFromStyleGuideFalsePositive2
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass English (example from style guide) (False positive) 3', () => {
    const mock = datasets.passEnglishExampleFromStyleGuideFalsePositive3
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Fail English (example from style guide) 1', () => {
    const mock = datasets.failEnglishExampleFromStyleGuide1
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['YOUNG AMERICANS'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English (example from style guide) 2', () => {
    const mock = datasets.failEnglishExampleFromStyleGuide2
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['the downward spiral'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English (example from style guide) 3', () => {
    const mock = datasets.failEnglishExampleFromStyleGuide3
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['a TIMe to lOVE'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English (last word in track title not cap)', () => {
    const mock = datasets.failEnglishLastWordInTrackTitleNotCap
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['track_name'])
    assert.deepEqual(occurrence.value, ['I Got The - single'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English ("And" in track title should be lowercase)', () => {
    const mock = datasets.failEnglishAndInTrackTitleShouldBeLowercase
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['track_name'])
    assert.deepEqual(occurrence.value, ['Me And You'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Fail English ("YOu" in track title has cap after first letter)', () => {
    const mock = datasets.failEnglishYOuInTrackTitleHasCapAfterFirstLetter
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['track_name'])
    assert.deepEqual(occurrence.value, ['Me and YOu'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Pass Spanish (see style guide)', () => {
    const mock = datasets.passSpanishSeeStyleGuide
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Fail Spanish (lowercase after /)', () => {
    const mock = datasets.failSpanishLowercaseAfter
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['Popurrí: Guitarras de media noche / ya no me quieres / Paloma querida (En directo)'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Pass Spanish (from style guide) 1', () => {
    const mock = datasets.passSpanishFromStyleGuide1
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass Spanish (from style guide) 2', () => {
    const mock = datasets.passSpanishFromStyleGuide2
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass Spanish (both tracks on same album are sentence case, for both release name and track title)', () => {
    const mock = datasets.passSpanishBothTracksOnSameAlbumAreSentenceCaseForBothReleaseNameAndTrackTitle
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Fail Spanish (One track on same album is sentence case, other track is title case)', () => {
    const mock = datasets.failSpanishOneTrackOnSameAlbumIsSentenceCaseOtherTrackIsTitleCase
    const [occurrence1, occurrence2] = filter(mock)

    assert.deepEqual(occurrence1.field, ['track_name'])
    assert.deepEqual(occurrence1.value, ['Soy un caso de oraciones'])
    assert.deepEqual(occurrence1.explanation_id, [inconsistentExplanationId])
    assert.deepEqual(occurrence1.error_type, [defaultErrorType])

    assert.deepEqual(occurrence2.field, ['track_name'])
    assert.deepEqual(occurrence2.value, ['Soy el Caso del Título'])
    assert.deepEqual(occurrence2.explanation_id, [inconsistentExplanationId])
    assert.deepEqual(occurrence2.error_type, [defaultErrorType])
  })

  it('Pass Portuguese (see style guide)', () => {
    const mock = datasets.passPortugueseSeeStyleGuide
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Fail Portuguese (lowercase after /)', () => {
    const mock = datasets.failPortugueseLowercaseAfter
    const [occurrence] = filter(mock)
    assert.deepEqual(occurrence.field, ['release_name'])
    assert.deepEqual(occurrence.value, ['Pot-pourri: Guitarras da meia noite / você não me quer / Paloma querida (Ao vivo)'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('Pass Portuguese (from style guide) 1', () => {
    const mock = datasets.passPortugueseFromStyleGuide1
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass Portuguese (from style guide) 2', () => {
    const mock = datasets.passPortugueseFromStyleGuide2
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Pass Portuguese (both tracks on same album are sentence case, for both release name and track title)', () => {
    const mock = datasets.passPortugueseBothTracksOnSameAlbumAreSentenceCaseForBothReleaseNameAndTrackTitle
    let occurrences = filter(mock)
    assert.equal(occurrences, false)
  })

  it('Fail Portuguese (One track on same album is sentence case, other track is title case)', () => {
    const mock = datasets.failPortugueseOneTrackOnSameAlbumIsSentenceCaseOtherTrackIsTitleCase
    const occurrences = filter(mock)
    const [occurrence1, occurrence2] = occurrences

    assert.deepEqual(occurrence1.field, ['track_name'])
    assert.deepEqual(occurrence1.value, ['Ainda outro título'])
    assert.deepEqual(occurrence1.explanation_id, [inconsistentExplanationId])
    assert.deepEqual(occurrence1.error_type, [defaultErrorType])

    assert.deepEqual(occurrence2.field, ['track_name'])
    assert.deepEqual(occurrence2.value, ['Este Não É'])
    assert.deepEqual(occurrence2.explanation_id, [inconsistentExplanationId])
    assert.deepEqual(occurrence2.error_type, [defaultErrorType])
  })
})
