'use strict'

const filterMeta = require('./filters-meta').trackcountthreshold
const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {Array} dataset
 * @param {number} trackCountThreshold
 * @returns {Array}
 */
module.exports = function (dataset, trackCountThreshold) {
  const occurrences = []

  // Rule: It is an error if the value of the "Track No." field is greater than the track count threshold.

  dataset.forEach((row, index) => {
    if (row.hasOwnProperty('track_no') && row['track_no'].toString().length > 0) {
      let trackNumber = parseInt(row['track_no'])

      if (trackNumber > trackCountThreshold) {
        let occurrence = {
          'row_id': index,
          'field': ['track_no'],
          'value': [row['track_no']],
          'explanation_id': [defaultExplanationId],
          'error_type': [defaultErrorType]
        }

        occurrences.push(occurrence)
      }
    }
  })

  return occurrences
}
