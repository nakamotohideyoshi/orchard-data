// filter: formatting of "featuring"

module.exports = function (row, idx) {
  const removeDiacritics = require('../scripts/remove-diacritics')
  const stringUtils = require('../scripts/string-utils')

  const filterName = 'filter11'
  const filterMeta = require('./filters-meta')[filterName]

  const defaultErrorType = filterMeta['type']
  const defaultExplanationId = 'default'

  const fields = ['release_name', 'release_artists_featuring', 'track_name',
    'track_artist_featuring']

  const validPatterns = [/feat\./g, /with +/g]

  const invalidPatterns = {
    'english': [
      /feat(uring)?/gi,
      /with/gi,
      /w\//gi,
      /w\\/gi
    ],

    'portuguese': [
      /estrel(ad(o|a)(s)?|ando)/gi,
      /apresent(ad(o|a)(s)?|ando)/gi,
      /com/gi,
      /c\//gi,
      /c\\/gi
    ],

    'spanish': [
      /protagoniz(ad(o|a)(s)?|ando)/gi,
      /present(ad(a|o)(s)?|ando)/gi,
      /con/gi,
      /c\//gi,
      /c\\/gi
    ]
  }

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const closeTokens = ']})'

  // no error
  if (!row['release_artists_featuring'] && !row['track_artist_featuring']) { return false }

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    let value = row[field]

    if (value) {
      value = removeDiacritics(value).trim()

      const parensStr = stringUtils.stripParentheses(value)

      // No parentheses on release name or parentheses are not normalized
      if (parensStr.length === 0 ||
         !stringUtils.parenthesesAreBalanced(parensStr)) { continue }

      // Checks if string ends in parentheses
      const lastChar = value[value.length - 1]
      if (closeTokens.indexOf(lastChar) === -1) { continue }

      const parensValue = stringUtils.getTextBetweenParentheses(value)

      // Tests valid strings. If found, proceedes to next field
      let match = false
      validPatterns.forEach(regExp => {
        if (regExp.test(parensValue)) { match = true }
      })
      if (match) { continue }

      // Tests invalid strings for each language
      const languages = Object.keys(invalidPatterns)

      // uses a for loop because for each does not allow break
      for (let j = 0; j < languages.length; j++) {
        match = false

        // iterates over each language
        const regexes = invalidPatterns[languages[j]]

        // for each invalid regex
        for (let k = 0; k < regexes.length; k++) {
          const regExp = regexes[k]

          // if it's a match, report occurrence
          if (regExp.test(parensValue)) {
            occurrence.field.push(field)
            occurrence.value.push(row[field])
            occurrence.explanation_id.push(defaultExplanationId)
            occurrence.error_type.push(defaultErrorType)

            // there is already a wrong string. doesn't need to test other
            // regexes
            match = true
            break
          }
        }

        // a occurrence happened
        if (match) {
          match = false
          break
        }
      }
    }
  }

  // If anything error occurred, creates report
  if (occurrence.field.length > 0) { return occurrence } else { return false }
}
