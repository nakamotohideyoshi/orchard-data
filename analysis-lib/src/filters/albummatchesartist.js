'use strict'

const filterMeta = require('./filters-meta').albummatchesartist

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {Object} row
 * @param {number} index
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = function (row, index) {
  const occurrence = {
    'row_id': index,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  // Rules:
  // - It is an error for release name to be the same as artist name.
  // - The string match is case-insensitive
  // - A substring match is not an error
  // - This test applies to every row in a matching release, so one with 10 tracks will have 10 errors
  // - This only compares the fields in the following Input Fields: Release Name, Release Artist(s)-Primary Artist(s)

  let releaseNameIsSet = row.hasOwnProperty('release_name') && row.release_name !== null && row.release_name.length > 0
  let releaseArtistPrimaryArtistIsSet = row.hasOwnProperty('release_artists_primary_artist') && row.release_artists_primary_artist !== null && row.release_artists_primary_artist.length > 0

  if (releaseNameIsSet && releaseArtistPrimaryArtistIsSet) {
    let releaseNameFormatted = row.release_name.toLowerCase().trim()
    let releaseArtistPrimaryArtistFormatted = row.release_artists_primary_artist.toLowerCase().trim()

    if (releaseNameFormatted === releaseArtistPrimaryArtistFormatted) {
      occurrence.field.push('release_name')
      occurrence.value.push(row.release_name)
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }
  }

  return occurrence.field.length > 0 ? occurrence : false
}
