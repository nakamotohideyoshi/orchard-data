const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = require('path').parse(__filename).name
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const [defaultExplanationId] = Object.keys(filterMeta.explanations)

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: emoji in Release Name', () => {
    mocks.failDueToEmojiInReleaseName.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['My 😀 Emoji'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Primary Artist(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsPrimaryArtists.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['Cicero 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Imprint', () => {
    mocks.failDueToEmojiInImprint.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['imprint'])
      assert.deepEqual(occurrence.value, ['Example Label 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Publisher(s)', () => {
    mocks.failDueToEmojiInPublishers.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['publishers'])
      assert.deepEqual(occurrence.value, ['Viva Data 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Composer(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsComposers.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_composer'])
      assert.deepEqual(occurrence.value, ['Ludwig 😀 B'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Conductor(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsConductors.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_conductor'])
      assert.deepEqual(occurrence.value, ['Ludwig 😀 B'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Ensemble(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsEnsembles.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_ensemble'])
      assert.deepEqual(occurrence.value, ['Kronos 😀tet'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Featuring(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsFeaturings.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_featuring'])
      assert.deepEqual(occurrence.value, ['Yo-😀 Ma'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Orchestra(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsOrchestras.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_orchestra'])
      assert.deepEqual(occurrence.value, ['😀 Symphony'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Release Artist(s)-Remixer(s)', () => {
    mocks.failDueToEmojiInReleaseArtistsRemixers.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_artists_remixer'])
      assert.deepEqual(occurrence.value, ['DJ 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist', () => {
    mocks.failDueToEmojiInTrackArtist.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist'])
      assert.deepEqual(occurrence.value, ['Cicero 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist(s) - Composer(s)', () => {
    mocks.failDueToEmojiInTrackArtistsComposers.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist_composer'])
      assert.deepEqual(occurrence.value, ['Ludwig 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist(s) - Conductor(s)', () => {
    mocks.failDueToEmojiInTrackArtistsConductors.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist_conductor'])
      assert.deepEqual(occurrence.value, ['Herbert Von 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist(s) - Ensemble(s)', () => {
    mocks.failDueToEmojiInTrackArtistsEnsembles.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist_ensemble'])
      assert.deepEqual(occurrence.value, ['Kronos 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist(s) - Featuring(s)', () => {
    mocks.failDueToEmojiInTrackArtistsFeaturings.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist_featuring'])
      assert.deepEqual(occurrence.value, ['😀 the Rapper'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist(s) - Orchestra(s)', () => {
    mocks.failDueToEmojiInTrackArtistsOrchestras.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist_orchestra'])
      assert.deepEqual(occurrence.value, ['😀 Orchestra'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Artist(s) - Remixer(s)', () => {
    mocks.failDueToEmojiInTrackArtistsRemixers.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_artist_remixer'])
      assert.deepEqual(occurrence.value, ['DJ 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in Track Name', () => {
    mocks.failDueToEmojiInTrackName.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['track_name'])
      assert.deepEqual(occurrence.value, ['Lorem 😀 Ipsum'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in [C] Information', () => {
    mocks.failDueToEmojiInCInformation.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['copyright_information'])
      assert.deepEqual(occurrence.value, ['Ellen 😀'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji in [P] Information', () => {
    mocks.failDueToEmojiInPInformation.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['p_information'])
      assert.deepEqual(occurrence.value, ['2018 Viva 😀 Data'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: emoji ⛄ in Release Name', () => {
    mocks.failDueToEmojiInReleaseNameAgain.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['My ⛄ Emoji'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
})
