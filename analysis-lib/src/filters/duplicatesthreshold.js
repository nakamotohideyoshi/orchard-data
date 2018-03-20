'use strict'

const filterMeta = require('./filters-meta').duplicatesthreshold

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {{metadata: Object, dataset: Array}} dataset
 * @returns {Array<{row_id: number, field: array, value: array, explanation_id: array, error_type: array}>}
 */
module.exports = function (dataset) {
  const occurrences = []

  // Convert duplicatesThreshold into fraction (percentage) by dividing it by 100.

  let duplicatesThreshold = dataset.metadata.duplicates_threshold / 100

  // Rule: Let the duplicates ratio be the number of ISRCs which appear in more than one track divided by the
  // total number of tracks.

  let alreadyRegisteredISRCList = []

  let duplicatedISRC = []

  let numberOfDuplicates = 0

  let totalNumberOfTracks = dataset.dataset.length

  dataset.dataset.forEach((row) => {
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

  dataset.dataset.forEach((row, index) => {
    if (row.hasOwnProperty('isrc') && row['isrc'].length > 0 && duplicatedISRC.indexOf(row['isrc']) > -1) {
      const occurrence = {
        'row_id': index,
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

  console.log(reportSummaryExtension) // TODO: Change REST API to carry this info.

  return occurrences
}
