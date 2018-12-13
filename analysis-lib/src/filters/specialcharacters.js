'use strict'

const is = require('@sindresorhus/is')
const emojiRegex = require('emoji-regex')()
const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const fieldsToCheck = [
  'imprint', // Imprint
  'orchard_artist', // Orchard Artist
  'publishers', // Publisher(s)
  'release_artists_primary_artist', // Release Artist(s)-Composer(s)
  'release_artists_featuring', // Release Artist(s)-Conductor(s)
  'release_artists_remixer', // Release Artist(s)-Ensemble(s)
  'release_artists_composer', // Release Artist(s)-Featuring(s)
  'release_artists_orchestra', // Release Artist(s)-Orchestra(s)
  'release_artists_ensemble', // Release Artist(s)-Primary Artist(s)
  'release_artists_conductor', // Release Artist(s)-Remixer(s)
  'release_name', // Release Name
  'track_artist', // Track Artist
  'track_artist_featuring', // Track Artist(s) - Composer(s)
  'track_artist_remixer', // Track Artist(s) - Conductor(s)
  'track_artist_composer', // Track Artist(s) - Ensemble(s)
  'track_artist_orchestra', // Track Artist(s) - Featuring(s)
  'track_artist_ensemble', // Track Artist(s) - Orchestra(s)
  'track_artist_conductor', // Track Artist(s) - Remixer(s)
  'track_name', // Track Name
  'copyright_information', // [C] Information
  'p_information' // [P] Information
]

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

  /**
   * Rule: Given the size of the search expression X the number of fields to check X the number of lines, this may create
   * impossible performance problems. If so we will have to find a more efficient but less standard algorithm, like running
   * the regex against the entire input file.
   */
  fieldsToCheck.forEach(field => {
    /** @type {string} */
    const fieldValue = row[field]

    if (is.string(fieldValue) && fieldValue.search(emojiRegex) >= 0) {
      occurrence.field.push(field)
      occurrence.value.push(fieldValue)
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }
  })

  return (occurrence.field.length > 0) ? occurrence : false
}

module.exports = filter
