'use strict'

const filterMeta = require('./filters-meta').nazipropaganda

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const fieldsToCheck = [
  'release_name',
  'orchard_artist',
  'artist_url',
  'release_artists_primary_artist',
  'release_artists_featuring',
  'release_artists_remixer',
  'imprint',
  'genre',
  'sub_genre',
  'track_name',
  'track_artist',
  'track_artist_featuring',
  'track_artist_remixer'
]

const naziKeywords = [
  'hakenkreuz',
  'parteiadler',
  'thule society',
  'ku klux klan',
  'wolfsangel',
  'celtic cross',
  'solar cross',
  'thule society',
  'othala rune',
  'sturmabteilung',
  'sig runes',
  'totenkopf',
  'kampfgeschwader 54',
  'reichsadler',
  'reichskriegsflagge'
]

/**
 * @param {Object} row
 * @param {number} index
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = function (row, index) {
  const occurrence = {
    'row_id': index,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': []
  }

  // Rule: It is an error if any word from the nazi keyword list occurs in the list of input fields below:
  //
  // - Release Name
  // - Orchard Artist
  // - Artist URL
  // - Release Artist(s)-Primary Artist(s)
  // - Release Artist(s)-Featuring(s)
  // - Release Artist(s)-Remixer(s)
  // - Imprint
  // - Genre
  // - Sub-genre
  // - Track Name
  // - Track Artist
  // - Track Artist(s) - Featuring(s)
  // - Track Artist(s) - Remixer(s)
  //
  // Let the nazi keyword list be the following terms:
  //
  // - Hakenkreuz
  // - Parteiadler
  // - Thule Society
  // - Ku Klux Klan
  // - Wolfsangel
  // - Celtic cross
  // - Solar cross
  // - Thule Society
  // - Othala rune
  // - Sturmabteilung
  // - Sig runes
  // - Totenkopf
  // - Kampfgeschwader 54
  // - Reichsadler
  // - Reichskriegsflagge

  fieldsToCheck.forEach((field) => {
    if (row.hasOwnProperty(field) && row[field].toString().length > 0) {
      naziKeywords.forEach((naziKeyword) => {
        let fieldContainsNaziKeyword = (row[field].toLowerCase().indexOf(naziKeyword) > -1)

        if (fieldContainsNaziKeyword) {
          occurrence.field.push(field)
          occurrence.value.push(row[field])
          occurrence.explanation_id.push(defaultExplanationId)
          occurrence.error_type.push(defaultErrorType)
        }
      })
    }
  })

  return occurrence.field.length === 0 ? false : occurrence
}
