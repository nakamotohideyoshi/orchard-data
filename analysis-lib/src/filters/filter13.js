'use strict'

const removeDiacritics = require('../scripts/remove-diacritics')

const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const fields = ['release_name', 'track_name']

const patterns = {
  'valid': [
    /\bVol\. ?(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|[0-9]+)+\b/g,
    /\bPt\. ?(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|[0-9]+)+\b/g
  ],

  'invalidAbbreviations': [
    /\bvol ?(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|[0-9]+)+\b/gi,
    /\bpt ?(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|[0-9]+)+\b/gi
  ],

  'invalidStrings': [
    /volume ?(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|[0-9]+)+\b/gi,
    /part ?(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|[0-9]+)+\b/gi
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

  fields.forEach(field => {
    let value = row[field]

    if (value) {
      value = removeDiacritics(value)
      value = value.trim()
      let error = false

      // volume or part followed by a number appears
      patterns['invalidStrings'].forEach(pattern => {
        if (value.match(pattern)) {
          error = true
        }
      })

      // if there's already an error, we don't need to test other cases
      if (!error) {
        patterns['invalidAbbreviations'].forEach(invalidAbbr => {
          // tested for vol or pt
          if (value.match(invalidAbbr)) {
            // if this doesn't change, then it's an error
            error = true

            // tests for a period after abbreviation
            patterns['valid'].forEach(validPattern => {
              if (value.match(validPattern)) {
                error = false
              }
            })
          }
        })
      }

      if (error) {
        occurrence.field.push(field)
        occurrence.value.push(row[field])
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
      }
    }
  })

  return (occurrence.field.length > 0) ? occurrence : false
}
