// misspelled "various artists"

// retrieves filter description
const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

module.exports = function (row, idx) {
  let language = row['release_meta_language'] ? row['release_meta_language'].trim().toLowerCase() : 'english'
  const field = 'release_artists_primary_artist'

  // common misspellings pattern includding correct spelling
  const commonPatterns = {
    'english': [/^(vario)u?(s)(,?\.? ?(artist)s?)?$/i],
    'portuguese': [/^(varios)(-?,?\.? ?(interpretes)?)?$/i,
      /^(varios)(-?,?\.? ?(artista)(s)?)?$/i],
    'spanish': [/^(varios)(-?,?\.? ?(artista)(s)?)?$/i]
  }

  const matchPattern = {
    'english': /(^various artists$)/gi,
    'portuguese': /(^vários intérpretes$)/gi,
    'spanish': /(^varios artistas$)/gi
  }
  // language not supported
  if (!(language in commonPatterns)) { return false }

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const primaryArtist = row[field] ? row[field].trim().toLowerCase() : ''

  const langPatterns = commonPatterns[language]
  const regExp1 = matchPattern[language]

  for (let i = 0; i < langPatterns.length; i++) {
    const regExp = langPatterns[i]

    // matching with misspelled "various artists" pattern
    if (primaryArtist.match(regExp)) {
      if (!primaryArtist.match(regExp1)) {
        occurrence.field.push(field)
        occurrence.value.push(row[field])
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
        break
      }
    }
  }
  // If anything error occurred, creates report
  if (occurrence.field.length > 0) { return occurrence }

  return false
}
