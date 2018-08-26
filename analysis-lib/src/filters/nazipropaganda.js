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
  'reichskriegsflagge',
  'Iron Cross',
  'Orion',
  'Iron Eagle',
  'RAHOWA',
  'ROA',
  'ZOG',
  'Crossed Hammers',
  'Triskelion',
  'Reich',
  'Reichskriegsflagge',
  '14',
  '88',
  'BH or 28',
  'WP/WS/WN',
  'WPWW',
  "Death's Head",
  'SS',
  'SA/Brownshirts',
  'ZOG',
  'White genocide',
  'Abwehr',
  'Aktion T4',
  'Anschluss',
  'anti-Semitism',
  'Aryan',
  'Aryan certificate',
  'Aryan paragraph',
  'autarky',
  'Blockleiter',
  'Blutorden',
  'Blut und Boden',
  'Brownshirt',
  'Bund Deutscher Madel',
  'concentration camp',
  'Deutsche Arbeitsfront',
  'Deutscheblutiger',
  'Dolchstosslegende',
  'emergency powers',
  'Enabling Act',
  'eugenics',
  'euthanasia',
  'fascism',
  'fuhrer',
  'fuhrerprinzip',
  'functionalism',
  'Gauleiter',
  'Gestapo',
  'gleichschaltung',
  'Great Depression',
  'gypsies',
  'Romany',
  'Hitler Jugend',
  'Holocaust',
  'Hitler Youth',
  'Hitler Jugend',
  'intentionalism',
  'Iron Cross',
  "Jehovah's Witnesses",
  'Judaism',
  'Juden',
  'Jungmadelbund',
  'Jungvolk',
  'Junkers',
  'Kraft durche Freude',
  'Kriegsmarine',
  'Kristallnacht',
  'Lebensborn',
  'lebensraum',
  'Lebensunwertes leben',
  'Luftwaffe',
  'Marxism',
  'master race',
  'Mein Kampf',
  'mischlinge',
  'nationalism',
  'National Socialism',
  'Nazi',
  'Nazism',
  'Night of the Long Knives',
  'Nuremberg Laws',
  'paramilitary',
  'Reichsarbeitdienst',
  'Reichskirche',
  'Reichstag',
  'Reichswehr',
  'Sturmabteilung',
  'Schutzstaffel',
  'Sicherheitsdienst',
  'Social Democratic Party',
  'Sonderweg',
  'stab-in-the-back theory',
  'Hakenkrauz',
  'swastika',
  'Third Reich',
  'totalitarianism',
  'Twenty-Five Points',
  'ubermensch',
  'untermensch',
  'volkisch',
  'volksgemeinschaft',
  'Wehrmacht',
  'Weimaror'
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

  fieldsToCheck.forEach((field) => {
    if (row.hasOwnProperty(field) && row[field].toString().length > 0) {
      naziKeywords.forEach((naziKeyword) => {
        const searchTerm = new RegExp(`\\b${naziKeyword}\\b`, 'gi')
        const fieldContainsNaziKeyword = (row[field].search(searchTerm) !== -1)

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
