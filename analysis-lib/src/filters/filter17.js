'use strict'

const filterMeta = require('./filters-meta').filter17

const constants = require('../scripts/constants')

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'
const blankGenreExplanationId = 'blankGenre'

const fields = ['genre', 'sub_genre']

/**
 * Filter: Genres that don't exist in iTunes.
 * @param row
 * @param idx
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = function (row, idx) {
  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const GENRE = constants.GENRE

  fields.forEach(field => {
    let hasError = false

    let value = row[field]

    if ((field === 'sub_genre') && !value) {
      // Rule: Sub-genre can be blank.
      hasError = false
    } else if ((field === 'genre') && !value) {
      // Rule: Genre cannot be blank.
      occurrence.field.push(field)
      occurrence.value.push(row[field])
      occurrence.explanation_id.push(blankGenreExplanationId)
      occurrence.error_type.push(defaultErrorType)
    } else {
      value = value.toLowerCase()

      /**
       * @param {string} item
       * @returns {boolean}
       */
      let findIndexCallback = function (item) {
        return value === item.toLowerCase()
      }

      /**
       * @param {array} list
       * @returns {boolean}
       */
      let fieldValueMatchWith = function (list) {
        return list.findIndex(findIndexCallback) > -1
      }

      // Rule: Genre and sub-genre cannot match with a path under "Music Videos".
      if (fieldValueMatchWith(GENRE.MUSIC_VIDEO.PATHS)) {
        hasError = true
      } else if (fieldValueMatchWith(GENRE.RINGTONE.PATHS)) {
        // Rule: Genre and sub-genre cannot match with a path under "Ringtones".
        hasError = true
      } else if (fieldValueMatchWith(GENRE.MUSIC.NAMES) || fieldValueMatchWith(GENRE.MUSIC_VIDEO.NAMES) || fieldValueMatchWith(GENRE.RINGTONE.NAMES)) {
        // Rule: Genre and sub-genre have case-insensitive (which includes case-sensitive) matches with a "GENRE AS SHOWN ON THE STORE" value.
        hasError = false
      } else if (fieldValueMatchWith(GENRE.MUSIC.CODES) || fieldValueMatchWith(GENRE.MUSIC_VIDEO.CODES) || fieldValueMatchWith(GENRE.RINGTONE.CODES)) {
        // Rule: Genre and sub-genre have case-insensitive (which includes case-sensitive) matches with a "GENRE CODE FOR METADATA" value.
        hasError = false
      } else {
        // Rule: Genre and sub-genre have case-insensitive (which includes case-sensitive) matches with a "MUSIC PATH" value.
        // noinspection RedundantIfStatementJS
        if (fieldValueMatchWith(GENRE.MUSIC.PATHS)) {
          hasError = false
        } else { // Rule: Genre and sub-genre do not match any item in canonical list.
          hasError = true
        }
      }
    }

    if (hasError) {
      occurrence.field.push(field)
      occurrence.value.push(row[field])
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }
  })

  return occurrence.field.length === 0 ? false : occurrence
}
