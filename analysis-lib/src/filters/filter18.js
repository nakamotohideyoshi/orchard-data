'use strict'

const filterId = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterId]

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
  // in a release name or a track title: "(Explicit)", "(Clean)".

  let propertiesToCheck = ['release_name', 'track_name']

  propertiesToCheck.forEach(property => {
    if (row.hasOwnProperty(property) && row[property] !== null) {
      let releaseNameContainsExplicitTerm = (row[property].toLowerCase().indexOf('(explicit)') > -1)
      let releaseNameContainsCleanTerm = (row[property].toLowerCase().indexOf('(clean)') > -1)

      if (releaseNameContainsExplicitTerm || releaseNameContainsCleanTerm) {
        occurrence.field.push(property)
        occurrence.value.push(row[property])
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
      }
    }
  })

  // Rule: Let a track be marked as clean, explicit, or "clean-or-unknown" according to the value of the
  // "Explicit (No/Yes/Clean)" field. The match is case-insensitive.
  // If the value is "No" or blank, it is considered "clean-or-unknown."

  let isRowMarkedAsClean = function (row) {
    return row.hasOwnProperty('explicit') && row['explicit'] !== null ? (row.explicit.toLowerCase() === 'clean') : false
  }

  let isRowMarkedAsExplicit = function (row) {
    return row.hasOwnProperty('explicit') && row['explicit'] !== null ? (row.explicit.toLowerCase() === 'yes') : false
  }

  // If you need to check somewhere if the row is marked as "clean-or-unknown", uncomment the following function.
  //
  // let isRowMarkedAsCleanOrUnknown = function (row) {
  //   if (!row.hasOwnProperty('explicit')) {
  //     return false
  //   }
  //
  //   return (row.explicit.toLowerCase() === 'no') || (row.explicit === '');
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
      let releaseNameMatches = row.hasOwnProperty('release_name') ? (row.release_name === dataset[i].release_name) : false
      let trackNameMatches = row.hasOwnProperty('track_name') ? (row.track_name === dataset[i].track_name) : false
      let trackArtistMatches = row.hasOwnProperty('track_artist') ? (row.track_artist === dataset[i].track_artist) : false
      let IsrcDoesNotMatch = row.hasOwnProperty('isrc') ? (row.isrc !== dataset[i].isrc) : false

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
