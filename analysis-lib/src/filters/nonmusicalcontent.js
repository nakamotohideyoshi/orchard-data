'use strict'

const filterMeta = require('./filters-meta').nonmusicalcontent

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const fieldsToCheck = [
  'genre',
  'sub_genre'
]

const nonMusicalContentList = [
  'ANIME-00',
  'Anime',
  'COMEDY-00',
  'Comedy',
  'DISNEY-00',
  'Disney',
  'ENKA-00',
  'Enka',
  'FITNESS-WORKOUT-00',
  'Fitness',
  'HEALING-00',
  'Healing',
  'INSPIRATIONAL-00',
  'Inspirational',
  'KARAOKE-00',
  'Karaoke',
  'MEDITATION-00',
  'Meditation',
  'NATURE-00',
  'NOVELTY-00',
  'Nature',
  'Novelty',
  'RELAXATION-00',
  'Relaxation',
  'SOUND-EFFECT-00',
  'SPOKEN-WORD-00',
  'STANDUP-COMEDY-00',
  'STORIES-00',
  'Sound',
  'Spoken',
  'Standup',
  'Stories',
  'TRAVEL-00',
  'Travel',
  'VIDEOGAME-00',
  'Video',
  'YOGA-00',
  'Yoga'
]

/**
 * Filter: Clearly non-musical content.
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

  // Rule: It is an error if the genre or sub-genre is in the "non-musical content list", case-insensitive
  //
  // The genre can match either the human-friendly genre name ("Stories") or the computer-friendly one ("STORIES-00").
  //
  // Let the non-musical content list be:
  //
  // - Anime                ANIME-00
  // - Stories              STORIES-00
  // - Comedy               COMEDY-00
  // - Novelty              NOVELTY-00
  // - Standup Comedy       STANDUP-COMEDY-00
  // - Disney               DISNEY-00
  // - Enka                 ENKA-00
  // - Fitness & Workout    FITNESS-WORKOUT-00
  // - Inspirational        INSPIRATIONAL-00
  // - Karaoke              KARAOKE-00
  // - Healing              HEALING-00
  // - Meditation           MEDITATION-00
  // - Nature               NATURE-00
  // - Relaxation           RELAXATION-00
  // - Travel               TRAVEL-00
  // - Yoga                 YOGA-00
  // - Sound Effects        SOUND-EFFECT-00
  // - Video Game           VIDEOGAME-00
  // - Spoken Word          SPOKEN-WORD-00

  fieldsToCheck.forEach((field) => {
    if (row.hasOwnProperty(field) && row[field].toString().length > 0) {
      nonMusicalContentList.forEach((nonMusicalContent) => {
        let fieldValueIsNonMusicalContent = (row[field].toLowerCase() === nonMusicalContent)

        if (fieldValueIsNonMusicalContent) {
          occurrence.field.push(field)
          occurrence.value.push(row[field])
          occurrence.explanation_id.push(defaultExplanationId)
          occurrence.error_type.push(defaultErrorType)
        }
      })
    }
  })

  return (occurrence.field.length > 0) ? occurrence : false
}
