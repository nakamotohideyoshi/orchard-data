// keyword blacklist

module.exports = async function (row, idx, metadata) {
  'use strict'

  const removeDiacritics = require('../scripts/remove-diacritics')

  const filterName = 'keywordblacklist'
  const filterMeta = require('./filters-meta')[filterName]

  const defaultErrorType = filterMeta['type']
  const defaultExplanationId = 'default'

  const fields = ['release_name', 'track_name']

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  if (metadata[0]) {
    metadata = metadata[0] // TODO: Fix this workaround. Metadata should never come as array.
  }

  if (metadata['keyword_blacklist']) {
    // keywordblkacklist spilt with ' '
    const blacklistkeywords = metadata['keyword_blacklist'].trim().toLowerCase().replace('\r\n', '\n').split('\n')

    const result = await new Promise(async (resolve) => {
      let isblacklistMatch = false

      for (let field of fields) {
        const value = row[field] ? removeDiacritics(row[field]).trim().toLowerCase() : ''

        // check for keyword_blacklist
        blacklistkeywords.forEach(blacklistkeyword => {
          // regex pattern
          const pattern = new RegExp(blacklistkeyword, 'g')

          // if matched with blacklist
          if (value.match(pattern)) {
            isblacklistMatch = true
          }
        })

        // keyword matched with blacklist were found
        if (isblacklistMatch) {
          occurrence.field.push(field)
          occurrence.value.push(row[field])
          occurrence.explanation_id.push(defaultExplanationId)
          occurrence.error_type.push(defaultErrorType)
          break
        }
      }

      if (isblacklistMatch) {
        resolve(occurrence)
      } else {
        resolve(false)
      }
    })
    return result
  } else {
    return false
  }
}
