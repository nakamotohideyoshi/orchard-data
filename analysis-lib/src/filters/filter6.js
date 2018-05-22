// Composer as artist

const removeDiacritics = require('../scripts/remove-diacritics')

// retrieves filter description
const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

const defaultErrorType = filterMeta['type']

module.exports = function (dataset) {
  let hasMultipleComposers = false
  let lastTrackComposer

  const occurrences = []

  const artistFields = ['orchard_artist', 'release_artists_primary_artist']
  const composerFields = ['release_artists_composer', 'track_artist_composer']

  // Checks for multiple composers on track level
  dataset.forEach(row => {
    const trackComposer = row['track_artist_composer'] ? removeDiacritics(row['track_artist_composer']).trim().toLowerCase() : ''

    if (lastTrackComposer && (lastTrackComposer !== trackComposer)) { hasMultipleComposers = true }
    lastTrackComposer = trackComposer
  })

  // Runs filters
  dataset.forEach((row, idx) => {
    let genre = row['genre'] || row['sub_genre']
    genre = genre ? removeDiacritics(genre).trim().toLowerCase() : ''

    const occurrence = {
      'row_id': idx + 1,
      'dataset_row_id': row.rowid,
      'field': [],
      'value': [],
      'explanation_id': [],
      'error_type': []
    }

    // if fields are not empty
    if (row['release_artists_composer'] !== '' && row['track_artist_composer'] !== '') {
      artistFields.forEach(aField => {
        composerFields.forEach(cField => {
          const artist = row[aField] ? removeDiacritics(row[aField]).trim().toLowerCase() : ''
          const composer = row[cField] ? removeDiacritics(row[cField]).trim().toLowerCase() : ''

          // checks if genre is not classical
          if (artist === composer && genre !== 'classical') {
            occurrence.field.push([aField, cField])
            occurrence.value.push([row[aField], row[cField]])
            occurrence.explanation_id.push('notClassical')
            occurrence.error_type.push(defaultErrorType)
          } else if (artist === composer && hasMultipleComposers && genre === 'classical') {
            occurrence.field.push([aField, cField])
            occurrence.value.push([row[aField], row[cField]])
            occurrence.explanation_id.push('multipleComposers')
            occurrence.error_type.push(defaultErrorType)
          } else if (artist !== composer && !hasMultipleComposers && genre === 'soundtrack') {
            // checks if artist is different of composer if genre is soundtrack
            occurrence.field.push([aField, cField])
            occurrence.value.push([row[aField], row[cField]])
            occurrence.explanation_id.push('soundtrack')
            occurrence.error_type.push(defaultErrorType)
          }
        })
      })

      // If there was any occurrences
      if (occurrence.field.length > 0) { occurrences.push(occurrence) }
    }
  })

  return occurrences
}
