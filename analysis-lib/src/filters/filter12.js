'use strict'

const removeDiacritics = require('../scripts/remove-diacritics')
const stringUtils = require('../scripts/string-utils')

const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const patterns = {
  'english': [
    /(\blive\b)/
  ],

  'portuguese': [
    /(\bao vivo\b)/
  ],

  'spanish': [
    /(\ben vivo\b)/,
    /(\ben directo\b)/
  ]
}

const exactPatterns = {
  'english': [
    /(^live$)/
  ],

  'portuguese': [
    /(^ao vivo$)/
  ],

  'spanish': [
    /(^en vivo$)/,
    /(^en directo$)/
  ]
}

module.exports = function (row, idx) {
  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const releaseName = row['release_name'] ? removeDiacritics(row['release_name']).trim().toLowerCase() : ''
  const releaseVersion = row['release_version'] ? removeDiacritics(row['release_version']).trim().toLowerCase() : ''

  const trackName = row['track_name'] ? removeDiacritics(row['track_name']).trim().toLowerCase() : ''
  const trackVersion = row['version'] ? removeDiacritics(row['version']).trim().toLowerCase() : ''

  let releaseParens = stringUtils.getTextBetweenParentheses(releaseName)
  let trackParens = stringUtils.getTextBetweenParentheses(trackName)

  const languages = Object.keys(patterns)

  // tests if release is live
  let releaseIsLive = false

  for (let i = 0; i < languages.length; i++) {
    const langPatterns = patterns[languages[i]]
    const exactLangPatterns = exactPatterns[languages[i]]

    for (let k = 0; k < langPatterns.length; k++) {
      let regExp = exactLangPatterns[k]

      // if release name begins or ends with "live -" or "- live"
      let split = releaseName.split('-')
      if (regExp.test(split[0]) || regExp.test(split[1])) { releaseIsLive = true }
      if (releaseIsLive) { break }

      // If release name has only one word and it's live, or if version is live
      regExp = langPatterns[k]
      split = releaseName.split(' ')

      if ((split.length === 1 && regExp.test(split[0])) || regExp.test(releaseVersion)) { releaseIsLive = true }
      if (releaseIsLive) { break }

      // value inside parens is target string
      if (regExp.test(releaseParens)) {
        releaseIsLive = true
        break
      }
    }

    // does not need to test other languages
    if (releaseIsLive) { break }
  }

  // Release is definitely not live. So we don't need to proceed further
  if (!releaseIsLive) { return false }

  // Test tracks
  let trackIsLive = false

  for (let i = 0; i < languages.length; i++) {
    const langPatterns = patterns[languages[i]]
    const exactLangPatterns = exactPatterns[languages[i]]

    for (let k = 0; k < langPatterns.length; k++) {
      let regExp = exactLangPatterns[k]

      // if track name begins or ends with "live -" or "- live"
      let split = trackName.split('-')
      if (regExp.test(split[0]) || regExp.test(split[1])) { trackIsLive = true }
      if (trackIsLive) { break }

      // tests for patterns inside strings boundaries
      regExp = langPatterns[k]

      if (regExp.test(trackVersion)) { trackIsLive = true }
      if (trackIsLive) { break }

      // value inside parens is target string
      if (regExp.test(trackParens)) {
        trackIsLive = true
        break
      }
    }

    // does not need to test other languages
    if (trackIsLive) { break }
  }

  // finally
  if (trackIsLive) { return false } else {
    const field = 'track_name'

    occurrence.field.push(field)
    occurrence.value.push(row[field])
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)

    return occurrence
  }
}
