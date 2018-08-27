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

  it('should fail: Release Artist(s)-Primary Artist(s)', () => {
    const mock = mocks.shouldFailReleaseArtistPrimaryArtist
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Artist(s)-Featuring(s)', () => {
    const mock = mocks.shouldFailReleaseArtistFeaturing
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_featuring'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Artist(s)-Remixer(s)', () => {
    const mock = mocks.shouldFailReleaseArtistRemixer
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_remixer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Artist(s)-Composer(s)', () => {
    const mock = mocks.shouldFailReleaseArtistComposer
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_composer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Artist(s)-Orchestra(s)', () => {
    const mock = mocks.shouldFailReleaseArtistOrchestra
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_orchestra'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Artist(s)-Ensemble(s)', () => {
    const mock = mocks.shouldFailReleaseArtistEnsemble
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_ensemble'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Release Artist(s)-Conductor(s)', () => {
    const mock = mocks.shouldFailReleaseArtistConductor
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_conductor'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist', () => {
    const mock = mocks.shouldFailTrackArtist
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist(s) - Featuring(s)', () => {
    const mock = mocks.shouldFailTrackArtistFeaturing
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist_featuring'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist(s) - Remixer(s)', () => {
    const mock = mocks.shouldFailTrackArtistRemixer
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist_remixer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist(s) - Composer(s)', () => {
    const mock = mocks.shouldFailTrackArtistComposer
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist_composer'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist(s) - Orchestra(s)', () => {
    const mock = mocks.shouldFailTrackArtistOrchestra
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist_orchestra'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist(s) - Ensemble(s)', () => {
    const mock = mocks.shouldFailTrackArtistEnsemble
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist_ensemble'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: Track Artist(s) - Conductor(s)', () => {
    const mock = mocks.shouldFailTrackArtistConductor
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_artist_conductor'])
      assert.deepEqual(occurrence.value, ['A BLACKLISTED ARTIST'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: case-insensitive match', () => {
    const mock = mocks.shouldFailCaseInsensitiveMatch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['a blacklisted artist'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: first word in keyword blacklist is checked', () => {
    const mock = mocks.shouldFailFirstWordInKeywordBlacklistIsChecked
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['first keyword'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: last word in keyword blacklist is checked', () => {
    const mock = mocks.shouldFailLastWordInKeywordBlacklistIsChecked
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['last keyword'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: substring match', () => {
    const mock = mocks.shouldFailSubstringMatch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      assert.deepEqual(occurrence.value, ['prefix A BLACKLISTED ARTIST suffix'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass', () => {
    const mock = mocks.shouldPass
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    assert.equal(occurrences.length, 0)
  })
})
