// Additional information

module.exports = function (row, idx) {
  const removeDiacritics = require('../scripts/remove-diacritics')

  const filterName = 'filter10'
  const filterMeta = require('./filters-meta')[filterName]

  const defaultErrorType = filterMeta['type']
  const defaultExplanationId = 'default'

  const fields = ['track_name', 'release_name']
  let trackArtist = row['track_artist']

  trackArtist = trackArtist ? removeDiacritics(trackArtist).trim().toLowerCase() : ''

  // language defaults to english if not specified on tsv file
  let language = row['release_meta_language'] ? removeDiacritics(row['release_meta_language']).trim().toLowerCase() : ''
  language = language || ''

  const yearPattern = /\([0-9]{4}\)/

  const patterns = {
    'english': [
      /Album/gi,
      /[0-9]+\./gi,
      /Produced *By/gi,
      /(\(?|\[?)Exclusive(\)?]?)/gi,
      /- *Exclusive/gi,
      /(\(?|\[?)Limited Edition(\)?]?)/gi,
      /- *Limited Edition/gi
    ],

    'portuguese': [
      /Álbum/gi,
      /Album/gi,
      /[0-9]+\./gi,
      /Produzido *Por/gi,
      /(\(?|\[?)Exclusivo(\)?]?)/gi,
      /- *Exclusivo/gi,
      /(\(?|\[?)Edição Limitada(\)?]?)/gi,
      /(\(?|\[?)Edicao Limitada(\)?]?)/gi,
      /- *Edição Limitada/gi,
      /- *Edicao Limitada/gi
    ],

    'spanish': [
      /Álbum/gi,
      /Album/gi,
      /[0-9]+\./gi,
      /Producido *Por/gi,
      /(\(?|\[?)Exclusivo(\)?]?)/gi,
      /- *Exclusivo/gi,
      /(\(?|\[?)Edicion Limitada(\)?]?)/gi,
      /- *Edicion Limitada/gi
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

  fields.forEach(field => {
    let value = row[field]

    if (value) {
      value = removeDiacritics(value).trim().toLowerCase()

      // It is an error if a release name or track title is prefixed with the track artist's name and a hyphen.
      let valueHasHyphen = value.indexOf('-') !== -1
      let valueBeforeHyphenIsTheArtistName = value.split('-')[0].indexOf(trackArtist) !== -1
      if (valueHasHyphen && valueBeforeHyphenIsTheArtistName) {
        occurrence.field.push(field)
        occurrence.value.push(row[field])
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
      }

      // year inside parenthesis
      if (yearPattern.test(value)) {
        occurrence.field.push(field)
        occurrence.value.push(row[field])
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push('warning')
      }

      for (let i = 0; i < patterns[language].length; i++) {
        // tests invalid patterns
        const regExp = patterns[language][i]

        if (regExp.test(value)) {
          occurrence.field.push(field)
          occurrence.value.push(row[field])
          occurrence.explanation_id.push(defaultExplanationId)
          occurrence.error_type.push(defaultErrorType)

          break
        }
      }
    }
  })

  // If anything error occurred, creates report
  if (occurrence.field.length > 0) { return occurrence } else { return false }
}
