// filter: Soundtracks and scores must include version information in the album title

module.exports = function (row, idx) {
  const removeDiacritics = require('../scripts/remove-diacritics')
  const stringUtils = require('../scripts/string-utils')

  const filterName = 'filter8'
  const filterMeta = require('./filters-meta')[filterName]

  const defaultErrorType = filterMeta['type']
  const defaultExplanationId = 'default'

  const field = 'release_name'
  let value = row[field]
  value = value ? removeDiacritics(value).trim().toLowerCase() : ''

  if (!value) { return false }

  // language defaults to english if not specified on tsv file
  let language = row['release_meta_language'] ? removeDiacritics(row['release_meta_language']).trim().toLowerCase() : ''
  language = language || ''

  // retrieves genre
  let genre = row['genre'] || row['subgenre']
  genre = genre ? removeDiacritics(genre).trim().toLowerCase() : ''

  // nothing to be tested or genre is not soundtrack or not related to score
  if (!genre || (genre !== 'soundtrack' && !/Score/gi.test(genre))) { return false }

  let patterns = {
    'english': [
      /Soundtrack/gi,
      /Original Score/gi,
      /Music Inspired By/gi,
      /Original/gi,
      /Cast/gi,
      /Music From/gi
    ],

    'portuguese': [
      /Trilha Sonora/gi,
      /Trilha Sonora Original/gi,
      /Música inspirada por/gi,
      /Musica inspirada por/gi,
      /Música inspirada pelo/gi,
      /Musica inspirada pelo/gi,
      /Música inspirada pela/gi,
      /Musica inspirada pela/gi,
      /Original/gi,
      /Elenco/gi,
      /Música da/gi,
      /Musica da/gi,
      /Música de/gi,
      /Musica de/gi,
      /Música do/gi,
      /Musica do/gi
    ],

    'spanish': [
      /Banda Sonora/gi,
      /Banda Sonora Original/gi,
      /Música inspirada por/gi,
      /Musica inspirada por/gi,
      /Música inspirada en/gi,
      /Musica inspirada en/gi,
      /Original/gi,
      /Elenco/gi,
      /Reparto/gi,
      /Música de la/gi,
      /Musica de la/gi,
      /Música de/gi,
      /Musica de/gi,
      /Música del/gi,
      /Musica del/gi
    ]
  }

  // Just to grant the portuguese word for 'portuguese' is also detected if its set as the release_meta_language.
  patterns['portugues'] = patterns['portuguese']

  // Just to grant the spanish word for 'spanish' is also detected if its set as the release_meta_language.
  patterns['espanol'] = patterns['spanish']

  // language not supported
  if (!(language in patterns)) { return false }

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const parensStr = stringUtils.stripParentheses(value)

  // No parentheses on release name or parentheses are not normalized
  if (parensStr.length === 0 || !stringUtils.parenthesesAreBalanced(parensStr)) {
    occurrence.field.push(field)
    occurrence.value.push(row[field])
    occurrence.explanation_id.push(defaultExplanationId)
    occurrence.error_type.push(defaultErrorType)
  } else {
    // retrieves value inside parentheses
    const parenthesesValue = stringUtils.getTextBetweenParentheses(value)

    // tests each regex
    let match = false
    patterns[language].forEach(regExp => {
      if (regExp.test(parenthesesValue)) { match = true }
    })

    // if required values were not found, reports occurrence
    if (!match) {
      occurrence.field.push(field)
      occurrence.value.push(row[field])
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }
  }

  // If registered an occurrence, creates report
  if (occurrence.field.length > 0) { return occurrence } else { return false }
}
