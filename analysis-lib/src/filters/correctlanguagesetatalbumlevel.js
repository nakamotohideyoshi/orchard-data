'use strict'

const { loadModule } = require('cld3-asm')
var iso6391 = require('iso-639-1')

const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const MATCH_THRESHOLD = 0.90

module.exports = async function (row, idx) {
  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  const fieldsToEvaluate = ['release_name', 'track_name']
  let releaseLanguageCode = iso6391.getCode(row['release_meta_language'] ? row['release_meta_language'].trim().toLowerCase() : 'english')

  const cldFactory = await loadModule()
  const identifier = cldFactory.create(0, 1024)

  fieldsToEvaluate.forEach((field) => {
    const textToEvaluate = row[field]
    const findResult = identifier.findLanguage(textToEvaluate)

    if (!findResult.language) return

    // When it detects the text as latin, we consider it's spanish.
    if (findResult.language === 'la') findResult.language = 'es'

    if (findResult.language !== releaseLanguageCode) {
      if (findResult.probability > MATCH_THRESHOLD) {
        occurrence.field.push(field)
        occurrence.value.push(textToEvaluate)
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
      }
    }

    // Future: show expected language and detected language in score
    // const frequentResult = identifier.findMostFrequentLanguages(textToEvaluate, 3)
    // console.log(`Find most frequent languages for text "${textToEvaluate}..."`)
    // console.log(JSON.stringify(frequentResult))
  })

  identifier.dispose()

  return occurrence.field.length === 0 ? false : occurrence
}
