'use strict'

const filterMeta = require('./filters-meta').albumswithvsandmeets

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * Filter: Albums with vs. and meets - artists must be listed separately as primary.
 * @param {Object} row
 * @param {number} index
 * @param {Array} dataset
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = function (row, index, dataset) {
  const occurrence = {
    'row_id': index,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  // if release name is not set, returns
  if (!row.release_name) { return false }

  // Rule: Does the release name contain “Meets” or “vs.”? If not, there is no error.
  let releaseNameContainsMeetsTerm = (row.release_name.toLowerCase().indexOf(' meets ') > -1)
  let releaseNameContainsVsTerm = (row.release_name.toLowerCase().indexOf(' vs. ') > -1)

  if (!releaseNameContainsMeetsTerm && !releaseNameContainsVsTerm) {
    return false
  }

  // Rule: Is it a collection of different songs remixed by a single DJ? If not, there is no error.

  for (let i = 0; i < dataset.length; i++) {
    // Don't compare row with itself.
    if (i === index) {
      continue
    }

    let isRemixedByASingleDJ = (row.track_artist_remixer === dataset[i].track_artist_remixer)

    if (!isRemixedByASingleDJ) {
      return false
    }
  }

  // Rule: Is the mixing DJ listed at the album level and identified as Primary with the Remixer role? If not, there is an error.

  let mixingDjIsListedAtTheAlbumLevelAsRemixer = (row.release_artists_remixer === row.track_artist_remixer)

  if (!mixingDjIsListedAtTheAlbumLevelAsRemixer) {
    occurrence.field.push('release_artists_remixer')
    occurrence.value.push(row.release_artists_remixer)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  // Rule: Are the original artists (whose songs are being remixed) listed at the track level identified as Primary? If not, there is an error.

  let originalArtistsAreListedAtTrackLevel = (row.track_artist !== row.track_artist_remixer)

  if (!originalArtistsAreListedAtTrackLevel) {
    occurrence.field.push('track_artist')
    occurrence.value.push(row.track_artist)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  // Rule: Are the original artists listed at the album level? If so, there is an error.

  let originalArtistsAreListedAtTheAlbumLevel = (row.release_artists_primary_artist === row.track_artist)

  if (originalArtistsAreListedAtTheAlbumLevel) {
    occurrence.field.push('release_artists_primary_artist')
    occurrence.value.push(row.release_artists_primary_artist)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  return occurrence.field.length === 0 ? false : occurrence
}
