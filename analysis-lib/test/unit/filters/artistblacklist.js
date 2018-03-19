const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = 'artistblacklist'
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: Release Artist(s)-Primary Artist(s)', () => {
    mocks.shouldFailReleaseArtistPrimaryArtist.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistPrimaryArtist.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Release Artist(s)-Featuring(s)', () => {
    mocks.shouldFailReleaseArtistFeaturing.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistFeaturing.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_featuring'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Release Artist(s)-Remixer(s)', () => {
    mocks.shouldFailReleaseArtistRemixer.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistRemixer.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_remixer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Release Artist(s)-Composer(s)', () => {
    mocks.shouldFailReleaseArtistComposer.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistComposer.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_composer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Release Artist(s)-Orchestra(s)', () => {
    mocks.shouldFailReleaseArtistOrchestra.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistOrchestra.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_orchestra'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Release Artist(s)-Ensemble(s)', () => {
    mocks.shouldFailReleaseArtistEnsemble.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistEnsemble.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_ensemble'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Release Artist(s)-Conductor(s)', () => {
    mocks.shouldFailReleaseArtistConductor.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailReleaseArtistConductor.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_conductor'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist', () => {
    mocks.shouldFailTrackArtist.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtist.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist(s) - Featuring(s)', () => {
    mocks.shouldFailTrackArtistFeaturing.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtistFeaturing.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist_featuring'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist(s) - Remixer(s)', () => {
    mocks.shouldFailTrackArtistRemixer.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtistRemixer.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist_remixer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist(s) - Composer(s)', () => {
    mocks.shouldFailTrackArtistComposer.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtistComposer.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist_composer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist(s) - Orchestra(s)', () => {
    mocks.shouldFailTrackArtistOrchestra.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtistOrchestra.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist_orchestra'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist(s) - Ensemble(s)', () => {
    mocks.shouldFailTrackArtistEnsemble.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtistEnsemble.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist_ensemble'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: Track Artist(s) - Conductor(s)', () => {
    mocks.shouldFailTrackArtistConductor.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailTrackArtistConductor.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['track_artist_conductor'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: case-insensitive match', () => {
    mocks.shouldFailCaseInsensitiveMatch.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailCaseInsensitiveMatch.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['a blacklisted artist'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: first word in keyword blacklist is checked', () => {
    mocks.shouldFailFirstWordInKeywordBlacklistIsChecked.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailFirstWordInKeywordBlacklistIsChecked.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['first keyword'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: last word in keyword blacklist is checked', () => {
    mocks.shouldFailLastWordInKeywordBlacklistIsChecked.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailLastWordInKeywordBlacklistIsChecked.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['last keyword'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should fail: substring match', () => {
    mocks.shouldFailSubstringMatch.dataset.forEach((item, index) => {
      let metadata = mocks.shouldFailSubstringMatch.metadata
      let occurrence = filter(item, index, metadata)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['prefix A BLACKLISTED ARTIST suffix'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })
  it('should pass', () => {
    mocks.shouldPass.dataset.forEach((item, index) => {
      let metadata = mocks.shouldPass.metadata
      let occurrence = filter(item, index, metadata)
      assert.equal(occurrence, false)
    })
  })
})
