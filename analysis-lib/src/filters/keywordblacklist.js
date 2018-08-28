'use strict'

const filterId = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {Array} dataset
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = function (dataset, metadata) {
  const occurrences = []

  // For some reason, metadata comes as array, so we just use its first element.
  if (metadata[0]) metadata = metadata[0]

  // Skip this filter if there's no keywords in the blacklist.
  if (!metadata.keyword_blacklist) return occurrences

  // Rule: The keyword list is supplied by the user as a parameter when creating the dataset

  let keywordBlacklist = metadata.keyword_blacklist
    .replace('\r\n', '\n') // Replace CRLF by LF before splitting the list entries.
    .split('\n') // Split the list entries into an array.
    .map(blacklistedKeyword => blacklistedKeyword.trim()) // Trim array entries.
    .filter(blacklistedKeyword => blacklistedKeyword.length > 0) // Remove array empty entries.

  const fieldsToCheck = [
    'release_name',
    'track_name'
  ]

  dataset.forEach((row, index) => {
    const occurrence = {
      'row_id': index + 1,
      'dataset_row_id': row.rowid,
      'field': [],
      'value': [],
      'explanation_id': [],
      'error_type': []
    }

    // Rule: keyword match is case-insensitive

    fieldsToCheck.forEach((field) => {
      if (!row[field]) return

      for (let i = 0, l = keywordBlacklist.length; i < l; i++) {
        const blacklistedKeyword = keywordBlacklist[i]

        const searchTerm = new RegExp(`\\b${blacklistedKeyword}\\b`, 'gi')
        const fieldValueContainsBlacklistedKeyword = (row[field].search(searchTerm) !== -1)

        if (fieldValueContainsBlacklistedKeyword) {
          occurrence.field.push(field)
          occurrence.value.push(row[field])
          occurrence.explanation_id.push(defaultExplanationId)
          occurrence.error_type.push(defaultErrorType)
          break
        }
      }
    })

    if (occurrence.field.length > 0) occurrences.push(occurrence)
  })

  return occurrences
}
