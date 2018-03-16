// Composer as artist

module.exports = function (row, idx) {
  const removeDiacritics = require('../scripts/remove-diacritics')
  const stringUtils = require('../scripts/string-utils')

  const filterName = 'filter7'
  const filterMeta = require('./filters-meta')[filterName]

  const defaultErrorType = filterMeta['type']
  const defaultExplanationId = 'default'

  const fields = ['release_name', 'track_name']

  const invalidStrings = [
    /Album Version/gi,
    /Original Version/gi,
    /Previously Unreleased/gi,
    /Reissue/gi,
    /Original Mix/gi,
    /iTunes LP Version/gi,
    /Clean Version/gi,
    /Explicit Version/gi,
    /Mastered for iTunes/gi
  ]

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  // const openTokens = '({['
  const closeTokens = ')]}'

  fields.forEach(field => {
    let value = row[field].trim()

    // field is not null
    if (value) {
      value = removeDiacritics(value).trim().toLowerCase()

      const lastChar = value[value.length - 1]

      // checks if last char is parentheses
      if (closeTokens.indexOf(lastChar) !== -1) {
        // Get values in parentheses
        const parenthesesValue = stringUtils.getTextBetweenParentheses(value)

        for (let i = 0; i < invalidStrings.length; i++) {
          const regExp = invalidStrings[i]

          // Invalid string detected
          if (regExp.test(parenthesesValue)) {
            occurrence.field.push(field)
            occurrence.value.push(row[field])
            occurrence.explanation_id.push(defaultExplanationId)
            occurrence.error_type.push(defaultErrorType)
            break
          }
        }
      }
    }
  })

  // If anything error occurred, creates report
  if (occurrence.field.length > 0) { return occurrence } else { return false }
}
