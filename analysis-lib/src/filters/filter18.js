'use strict'

const filterMeta = require('./filters-meta').filter18

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * Filter: Explicit Flagging.
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

  // Rule: It is an error if the following terms occur (with a case-insensitive match)
  // in a release name: "(Explicit)", "(Clean)".

  let releaseNameContainsExplicitTerm = (row.release_name.toLowerCase().indexOf('(explicit)') > -1)
  let releaseNameContainsCleanTerm = (row.release_name.toLowerCase().indexOf('(clean)') > -1)

  if (releaseNameContainsExplicitTerm || releaseNameContainsCleanTerm) {
    occurrence.field.push('release_name')
    occurrence.value.push(row.release_name)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  // Rule: It is an error if the following terms occur (with a case-insensitive match)
  // in a track title: "(Explicit)", "(Clean)".

  let trackNameContainsExplicitTerm = (row.track_name.toLowerCase().indexOf('(explicit)') > -1)
  let trackNameContainsCleanTerm = (row.track_name.toLowerCase().indexOf('(clean)') > -1)

  if (trackNameContainsExplicitTerm || trackNameContainsCleanTerm) {
    occurrence.field.push('track_name')
    occurrence.value.push(row.track_name)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  // Rule: Let a track be marked as clean, explicit, or "clean-or-unknown" according to the value of the
  // "Explicit (No/Yes/Clean)" field. The match is case-insensitive.
  // If the value is "No" or blank, it is considered "clean-or-unknown."

  let isRowMarkedAsClean = function (row) {
    return (row.explicit.toLowerCase() === 'clean')
  }

  let isRowMarkedAsExplicit = function (row) {
    return (row.explicit.toLowerCase() === 'yes')
  }

  // If you need to check somewhere if the row is marked as "clean-or-unknown", uncomment the following function.
  //
  // let isRowMarkedAsCleanOrUnknown = function (row) {
  //   return (row.explicit.toLowerCase() === 'no') || (row.explicit.toLowerCase() === '');
  // };

  // Rule: It is an error if there is a track flagged clean and there is not an identical track marked explicit.
  // The identical version would have the same release name, track title, and track artist, but not the same isrc.

  if (isRowMarkedAsClean(row)) {
    let hasError = true
    let datasetLength = dataset.length

    for (let i = 0; i < datasetLength; i++) {
      // Don't compare row with itself.
      if (i === index) {
        continue
      }

      let isMarkedAsExplicit = isRowMarkedAsExplicit(dataset[i])
      let releaseNameMatches = (row.release_name === dataset[i].release_name)
      let trackNameMatches = (row.track_name === dataset[i].track_name)
      let trackArtistMatches = (row.track_artist === dataset[i].track_artist)
      let IsrcDoesNotMatch = (row.isrc !== dataset[i].isrc)

      if (isMarkedAsExplicit && releaseNameMatches && trackNameMatches && trackArtistMatches && IsrcDoesNotMatch) {
        hasError = false
        break
      }
    }

    if (hasError) {
      occurrence.field.push('explicit')
      occurrence.value.push(row.explicit)
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }
  }

  return occurrence.field.length === 0 ? false : occurrence
}
