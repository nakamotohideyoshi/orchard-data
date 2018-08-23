'use strict'

const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

// Definition: Let the tail of a track title be any component beginning with an open parenthesis or square bracket
// and closing with a matching parenthesis or square bracket, and with no non-parenthesized or bracketed text between
// the closing parenthesis or square bracket and the end of the line or field. So with the track title
// (lorem) ipsum (dolor)[sit], the tail is (dolor)[sit], and with the track title lorem (ipsum) dolor there is no tail.

/**
 * @param {string} trackTitle
 */
const extractTrackTitleHead = (trackTitle) => {
  const parenthesis = trackTitle.indexOf('(', 1)
  const squareBracket = trackTitle.indexOf('[', 1)
  const lastChar = trackTitle.charAt(trackTitle.length - 1)
  let trackTitleHeadEndIndex = trackTitle.length

  if (lastChar === ')' || lastChar === ']') {
    if (parenthesis !== -1 && squareBracket !== -1) {
      trackTitleHeadEndIndex = (parenthesis < squareBracket ? parenthesis : squareBracket)
    } else if (parenthesis !== -1) {
      trackTitleHeadEndIndex = parenthesis
    } else if (squareBracket !== -1) {
      trackTitleHeadEndIndex = squareBracket
    }
  }

  return trackTitle.substring(0, trackTitleHeadEndIndex)
}

/**
 * @param {string} trackTitle
 */
const extractTrackTitleTail = (trackTitle) => {
  const trackTitleHead = extractTrackTitleHead(trackTitle)
  const trackTitleTail = trackTitle.replace(trackTitleHead, '')
  return trackTitleTail
}

/**
 * @param {Object} row
 * @param {Number} idx
 */
const filter = (row, idx) => {
  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  let thereIsAnError = false

  const trackTitleTail = extractTrackTitleTail(row.track_name)

  const tailContainsParentheses = ((trackTitleTail.indexOf('(') !== -1) && (trackTitleTail.indexOf(')') !== -1))
  const tailContainsSquareBrackets = ((trackTitleTail.indexOf('[') !== -1) && (trackTitleTail.indexOf(']') !== -1))

  // Rule: If a tail contains both parentheses and square brackets, and square brackets are used before parens, it is an error.

  if (tailContainsParentheses && tailContainsSquareBrackets && (trackTitleTail.indexOf('[') < trackTitleTail.indexOf('('))) thereIsAnError = true

  // Rule: If a tail contains both parentheses and square brackets, and there is more than one set of parenthesis, it is an error.

  const setsOfParenthesisOnTail = trackTitleTail.split('(').length - 1

  if (setsOfParenthesisOnTail > 1) thereIsAnError = true

  // Rule:
  // If a tail contains both parentheses and square brackets, and there is more than one set of square brackets, it is not an error.
  // If a tail contains multiple explanatory references and the first one is in square brackets rather than parentheses, it is an error.

  const setsOfSquareBracketsOnTail = trackTitleTail.split('[').length - 1

  const tailContainsMultipleExplanatoryReferences = (setsOfSquareBracketsOnTail > 1)

  const theFirstOneIsInSquareBracketsRatherThanParentheses = (!tailContainsParentheses || trackTitleTail.indexOf('[') < trackTitleTail.indexOf('('))

  if (tailContainsMultipleExplanatoryReferences && theFirstOneIsInSquareBracketsRatherThanParentheses) thereIsAnError = true

  if (thereIsAnError) {
    occurrence.field.push('track_name')
    occurrence.value.push(row.track_name)
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  }

  return (occurrence.field.length > 0) ? occurrence : false
}

module.exports = filter
