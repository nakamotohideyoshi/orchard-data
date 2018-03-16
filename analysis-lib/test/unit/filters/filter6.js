const assert = require('chai').assert
const _ = require('lodash')

const filterId = 'filter6'

const mocks = require(`../../../mocks/filters/${filterId}`)

const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta['type']

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}`, () => {
  const report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('validates occurrences fields', () => {
    const dataset = mocks['invalidGenre']
    const occurrences = filter(dataset, report)

    occurrences.forEach(occurrence => {
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

  it('should report - genre is folk and composer is artist', () => {
    const { invalidGenre } = mocks

    const occurrences = filter(invalidGenre, report)

    occurrences.forEach((occurrence, idx) => {
      switch (idx) {
        case 0:
          // Fields with the same composer
          assert.deepEqual(occurrence.field, [
            ['orchard_artist', 'release_artists_composer'],
            ['orchard_artist', 'track_artist_composer'],
            ['release_artists_primary_artist', 'release_artists_composer'],
            ['release_artists_primary_artist', 'track_artist_composer']
          ])

          // Fields values
          assert.deepEqual(occurrence.value, [
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky'],
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky'],
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky'],
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky']
          ])

          // Fields values
          assert.deepEqual(occurrence.explanation_id, ['notClassical', 'notClassical', 'notClassical', 'notClassical'])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType, defaultErrorType, defaultErrorType])

          break
      }
    })
  })

  it('should not report - composer is artist but genre is classical', () => {
    const { validGenre } = mocks

    const occurrences = filter(validGenre, report)

    // method should not return occurrences
    assert.equal(_.isObject(occurrences), true)
    assert.equal(_.isEmpty(occurrences), true)
  })

  it('should not report - composer is not listed as artist', () => {
    const { valid } = mocks

    const occurrences = filter(valid, report)

    // method should not return occurrences
    assert.equal(_.isObject(occurrences), true)
    assert.equal(_.isEmpty(occurrences), true)
  })

  it('should report - multiple track composers and single release composer', () => {
    const { multipleTrackComposers } = mocks

    const occurrences = filter(multipleTrackComposers, report)

    occurrences.forEach((occurrence, idx) => {
      switch (idx) {
        case 0:
          // fields with the same composer
          assert.deepEqual(occurrence.field, [
            ['orchard_artist', 'release_artists_composer'],
            ['orchard_artist', 'track_artist_composer'],
            ['release_artists_primary_artist', 'release_artists_composer'],
            ['release_artists_primary_artist', 'track_artist_composer']
          ])

          // fields values
          assert.deepEqual(occurrence.value, [
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky'],
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky'],
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky'],
            ['Pyotr Ilyich Tchaikovsky', 'Pyotr Ilyich Tchaikovsky']
          ])

          // Fields values
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType, defaultErrorType, defaultErrorType])
          assert.deepEqual(occurrence.explanation_id, ['multipleComposers', 'multipleComposers', 'multipleComposers', 'multipleComposers'])

          break
      }
    })
  })

  // Valid test should return occurrence with empty fields
  it(`should report - genre is soundtrack, one composer on track level but artist
      is not composer`, () => {
    const { wrongName } = mocks

    const occurrences = filter(wrongName, report)

    occurrences.forEach((occurrence, idx) => {
      switch (idx) {
        case 0:
          // fields with the same composer
          assert.deepEqual(occurrence.field, [
            ['orchard_artist', 'release_artists_composer'],
            ['orchard_artist', 'track_artist_composer'],
            ['release_artists_primary_artist', 'release_artists_composer'],
            ['release_artists_primary_artist', 'track_artist_composer']
          ])

          // fields values
          assert.deepEqual(occurrence.value, [
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky'],
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky'],
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky'],
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky']
          ])

          // Fields values
          assert.deepEqual(occurrence.explanation_id, ['soundtrack', 'soundtrack', 'soundtrack', 'soundtrack'])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType, defaultErrorType, defaultErrorType])

          break

        case 1:
          // fields with the same composer
          assert.deepEqual(occurrence.field, [
            ['orchard_artist', 'release_artists_composer'],
            ['orchard_artist', 'track_artist_composer'],
            ['release_artists_primary_artist', 'release_artists_composer'],
            ['release_artists_primary_artist', 'track_artist_composer']
          ])

          // fields values
          assert.deepEqual(occurrence.value, [
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky'],
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky'],
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky'],
            ['Wrong Name', 'Pyotr Ilyich Tchaikovsky']
          ])

          // Fields values
          assert.deepEqual(occurrence.explanation_id, ['soundtrack', 'soundtrack', 'soundtrack', 'soundtrack'])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType, defaultErrorType, defaultErrorType])

          break
      }
    })
  })
})
