'use strict'

const filterMeta = require('./filters-meta').trackcountthreshold
const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {Array} dataset
 * @param {Object} metadata
 * @returns {Array}
 */
module.exports = function (dataset, metadata) {
  const occurrences = []
  const field = 'track_no'

  // if trackCountThreshold is defiend, then get trackCountThreshold.
  // if trackCountThreshold is undefiend, then set trackCountThreshold as -1.

  const trackCountThreshold = metadata[0].track_count_threshold ? metadata[0].track_count_threshold : -1

  if (trackCountThreshold === -1) {
    // if trackCountThreshold is undefiend, exit the process
    return occurrences
  } else {
    // Rule: It is an error if the value of the "Track No." field is greater than the track count threshold.
    dataset.forEach((row, index) => {
      if (row.hasOwnProperty(field) && row[field].toString().length > 0) {
        let trackNumber = parseInt(row[field])

        if (trackNumber > trackCountThreshold) {
          let occurrence = {
            'row_id': index + 1,
            'field': [field],
            'value': [row[field]],
            'explanation_id': [defaultExplanationId],
            'error_type': [defaultErrorType]
          }

          occurrences.push(occurrence)
        }
      }
    })

    return occurrences
  }
}
