'use strict'

const is = require('@sindresorhus/is')
const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'
const nonLinguisticContentExplanationId = 'nonLinguisticContent'

/**
 * @param {Object} row
 * @param {Number} idx
 */
const filter = (row, idx) => {
  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  // Rule: If either of the Release Meta Language or Meta Language fields are missing, null, or contain an empty string, it is an error.
  // The error message is "Release Meta Language and Meta Language must not be blank."
  // Input fields to check:
  // Release Meta Language (release_meta_language)
  // Meta Language (meta_language)

  const releaseMetaLanguageHasError = !is.string(row.release_meta_language) || is.emptyStringOrWhitespace(row.release_meta_language)
  const metaLanguageHasError = !is.string(row.meta_language) || is.emptyStringOrWhitespace(row.meta_language)

  if (releaseMetaLanguageHasError) {
    occurrence.field.push('release_meta_language')
    occurrence.value.push(row.release_meta_language)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  if (metaLanguageHasError) {
    occurrence.field.push('meta_language')
    occurrence.value.push(row.meta_language)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  // Rule: If the track genre is in the designated set and Meta Language does not contain "zxx", it is an error with message Non-linguistic
  // content must have Meta Language "zxx".
  //
  // The designated set is (any of the following):
  // | Guitar | GUITAR-00 |
  // | Chinese Flute | CHINESE-FLUTE-00  |
  // | Chinese Strings | CHINESE-STRINGS-00  |
  // | Brass & Woodwinds | BRASS-WOODWINDS-00  |
  // | Guitar | GUITAR-00  |
  // | Percussion | PERCUSSION-00  |
  // | Piano | PIANO-00  |
  // | Solo Instrumental | SOLO-INSTRUMENTAL-00  |
  // | Violin | VIOLIN-00 |
  // | Ambient | AMBIENT-00  |
  // | Bass | BASS-00  |
  // | Instrumental | INSTRUMENTAL-00  |
  // | Marching Bands | MARCHING-BANDS-00  |
  // | Nature | NATURE-00  |
  // | Surf | SURF-00  |
  // | Sound Effects | SOUND-EFFECT-00  |
  //
  // Input fields to check:
  // Meta Language (meta_language)
  // Genre (genre)

  const nonLinguisticGenres = [
    'Guitar',
    'GUITAR-00',
    'Chinese Flute',
    'CHINESE-FLUTE-00',
    'Chinese Strings',
    'CHINESE-STRINGS-00',
    'Brass & Woodwinds',
    'BRASS-WOODWINDS-00',
    'Guitar',
    'GUITAR-00',
    'Percussion',
    'PERCUSSION-00',
    'Piano',
    'PIANO-00',
    'Solo Instrumental',
    'SOLO-INSTRUMENTAL-00',
    'Violin',
    'VIOLIN-00',
    'Ambient',
    'AMBIENT-00',
    'Bass',
    'BASS-00',
    'Instrumental',
    'INSTRUMENTAL-00',
    'Marching Bands',
    'MARCHING-BANDS-00',
    'Nature',
    'NATURE-00',
    'Surf',
    'SURF-00',
    'Sound Effects',
    'SOUND-EFFECT-00'
  ]

  const nonLinguisticContentFlag = 'zxx'

  if (nonLinguisticGenres.includes(row.genre) && row.meta_language !== nonLinguisticContentFlag) {
    occurrence.field.push('meta_language')
    occurrence.value.push(row.meta_language)
    occurrence.explanation_id.push(nonLinguisticContentExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  return (occurrence.field.length > 0) ? occurrence : false
}

module.exports = filter
