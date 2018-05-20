'use strict'

const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const MATCH_THRESHOLD = 900

// https://www.npmjs.com/package/cld
const cld = require('cld')

module.exports = async function (row, idx) {
  const result = await new Promise(async (resolve) => {
    let releaseLanguage = (
      row['release_meta_language'] ? row['release_meta_language'].trim().toLowerCase() : 'english'
    ).toLowerCase()

    const occurrence = {
      'row_id': idx,
      'field': [],
      'value': [],
      'explanation_id': [],
      'error_type': []
    }

    var evaluator = function (field) {
      cld.detect(row[field], function (err, result) {
        if (err || !result.languages || result.languages.length < 1) {
          return
        }

        if (result.languages[0].name.toLowerCase() !== releaseLanguage) {
          if (result.languages[0].score > MATCH_THRESHOLD) {
            // future: show expected language and detected lanaguage in score
            occurrence.field.push(field)
            occurrence.value.push(row[field])
            occurrence.explanation_id.push(defaultExplanationId)
            occurrence.error_type.push(defaultErrorType)
          }
        }
      }) // end cld.detect
    } // end evaluator

    evaluator('release_name')
    evaluator('track_name')

    if (occurrence.field.length > 0) {
      resolve(occurrence)
    } else {
      resolve(false)
    }
  }) // end promise

  return result
}
