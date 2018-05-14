'use strict'

const filterMeta = require('./filters-meta').duplicatesthreshold

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {Array} dataset
 * @param {Object} metadata
 * @returns {Array<{row_id: number, field: array, value: array, explanation_id: array, error_type: array}>}
 */
module.exports = function (dataset, metadata) {
  const occurrences = []

  if (metadata[0]) {
    metadata = metadata[0] // TODO: Fix this workaround. Metadata should never come as array.
  }

  // Convert duplicatesThreshold into fraction (percentage) by dividing it by 100.
  let duplicatesThreshold = metadata.duplicates_threshold ? (metadata.duplicates_threshold / 100) : 0

  // Rule: Let the duplicates ratio be the number of ISRCs which appear in more than one track divided by the
  // total number of tracks.

  let alreadyRegisteredISRCList = []

  let duplicatedISRC = []

  let numberOfDuplicates = 0

  let totalNumberOfTracks = dataset.length

  dataset.forEach((row) => {
    if (row.hasOwnProperty('isrc') && row['isrc'].length > 0) {
      if (alreadyRegisteredISRCList.indexOf(row['isrc']) > -1) {
        if (duplicatedISRC.indexOf(row['isrc']) === -1) {
          duplicatedISRC.push(row['isrc'])
          numberOfDuplicates += 2
        } else {
          numberOfDuplicates++
        }
      } else {
        alreadyRegisteredISRCList.push(row['isrc'])
      }
    }
  })

  dataset.forEach((row, index) => {
    if (row.hasOwnProperty('isrc') && row['isrc'].length > 0 && duplicatedISRC.indexOf(row['isrc']) > -1) {
      const occurrence = {
        'row_id': index + 1,
        'dataset_row_id': row.rowid,
        'field': ['isrc'],
        'value': [row['isrc']],
        'explanation_id': [defaultExplanationId],
        'error_type': [defaultErrorType]
      }

      occurrences.push(occurrence)
    }
  })

  let duplicatesRatio = numberOfDuplicates / totalNumberOfTracks

  // Rule: Let exceeded be true if the duplicates ratio is equal to or greater than the value selected by the user

  let exceeded = (duplicatesRatio >= duplicatesThreshold)

  // Rule: The REST API for the report summary should be extended to carry the duplicates ratio, the gross number
  // of duplicates, and the exceeded flag.

  let reportSummaryExtension = {
    duplicatesRatio: duplicatesRatio,
    numberOfDuplicates: numberOfDuplicates,
    exceeded: exceeded
  }

  console.log('    ✓ report summary should also inform:', reportSummaryExtension) // TODO: Change REST API to carry this info.

  return occurrences
}
