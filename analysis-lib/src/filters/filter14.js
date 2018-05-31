// filter: Part and Volume should be abbreviated to Pt. and Vol.
'use strict'

module.exports = async function (row, idx) {
  const filterName = 'filter14'
  const filterMeta = require('./filters-meta')[filterName]

  const defaultErrorType = filterMeta['type']
  const defaultExplanationId = 'default'

  const fields = ['release_artists_primary_artist', 'track_artist']

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const result = await new Promise(async (resolve) => {
    // new syntax for the awesome async/await keywords!
    for (let field of fields) {
      let value = row[field]

      if (!value) { break }

      let divisorsCount = 0

      // check for &
      if (value.match(/&/g)) {
        divisorsCount += value.match(/&/g).length
      }
      // check for +
      if (value.match(/\+/g)) {
        divisorsCount += value.match(/\+/g).length
      }

      // check for 'and'
      if (value.match(/\band\b/gi)) {
        divisorsCount += value.match(/\band\b/gi).length
      }

      // only one occurrence of '&', '+' or 'and'
      if (value && divisorsCount === 1) {
        occurrence.field.push(field)
        occurrence.value.push(row[field])
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
      }
    };

    if (occurrence.field.length === 0) { resolve(false) } else { resolve(occurrence) }
  })

  return result
}
