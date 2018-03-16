// filter: Part and Volume should be abbreviated to Pt. and Vol.
'use strict'

module.exports = async function (row, idx) {
  const mb = require('../scripts/musicbrainz-interface')

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
      let divisor

      // check for &
      if (value.match(/&/g)) {
        divisor = '&'
        divisorsCount += value.match(/&/g).length
      }
      // check for +
      if (value.match(/\+/g)) {
        divisor = '+'
        divisorsCount += value.match(/\+/g).length
      }

      // check for 'and'
      if (value.match(/\band\b/gi)) {
        divisor = 'and'
        divisorsCount += value.match(/\band\b/gi).length
      }

      // only one occurrence of '&', '+' or 'and'
      if (value && divisorsCount === 1) {
        let artists = await mb.searchArtists(value)

        let match = mb.checkForArtistInMB(value, artists)

        // value not in musicbrainz db
        if (!match) {
          // splits string by the divisor and check for each occurrence
          const valueArtists = value.split(divisor)

          // if this doesn't change, then there's an error
          match = true

          for (let i = 0; i < valueArtists.length; i++) {
            let artist = valueArtists[i]

            // One of those artists is not in the list
            if (!mb.checkForArtistInMB(artist, artists)) {
              match = false
              break
            };
          }

          // both components were found
          if (match) {
            occurrence.field.push(field)
            occurrence.value.push(row[field])
            occurrence.explanation_id.push(defaultExplanationId)
            occurrence.error_type.push(defaultErrorType)
          }
        }
      }
    };

    if (occurrence.field.length === 0) { resolve(false) } else { resolve(occurrence) }
  })

  return result
}
