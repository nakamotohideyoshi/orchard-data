'use strict'

const filterId = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

/**
 * @param {Array} dataset
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
const filter = (dataset) => {
  const occurrences = []

  dataset.forEach((row, index) => {
    const occurrence = {
      'row_id': index + 1,
      'dataset_row_id': row.rowid,
      'field': [],
      'value': [],
      'explanation_id': [],
      'error_type': []
    }

    let thereIsARemixAlbumWithoutOriginalSongOnReleaseName = false
    let twoOrMoreTrackTitlesFromAlbumAreIdentical = false

    // Definition: Tail
    // Let the head of a track title end at either:
    // - the first hyphen
    // - the first parenthesis or square bracket after which there is no text not in parentheses or square brackets
    // So with the track title '(lorem) ipsum (dolor)[sit]', the tail is '(dolor)[sit]', and with the track title 'lorem (ipsum) dolor' there is no tail.
    // Then the *tail* is any text after the head.

    const getHeadOfTrackTitle = (trackTitle) => {

    }

    const getTailOfTrackTitle = (trackTitle) => {

    }

    //  Definition: Remix flag
    //  - A remix flag is set on the track is set if the tail contains any of the words "remix", "mix", "remixed", "mixed", delimited by word separators, case insensitive.
    //  - A remix flag on a track is set if the "Track Artist(s) - Remixer(s)" field is not blank.
    //  Note: we assume the track-level remixer will always be set, even if the album-level remixer is also set.

    //  Definition: Original song
    //  - If every track on an album has the same head, let the "original song" be the head.

    //  Definition: Remix album
    //  - A song is a remix of the original song if the remix flag is set and the title contains the original song.
    //  - If every track on an album is either the original song or a remix of the original song, the album is a remix album.

    const checkIfSongIsARemixOfTheOriginalSong = () => {

    }

    const checkIAlbumIsARemixAlbum = () => {

    }

    //  TESTS
    //  1. If there is a remix album, and the release name does not contain the original song, it is an error.
    //  2. If there is an original song for a release, and any two track titles on that release are identical, it is an error.

    if (thereIsARemixAlbumWithoutOriginalSongOnReleaseName) {
      occurrence.field.push('release_name')
      occurrence.value.push(row.release_name)
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }

    if (twoOrMoreTrackTitlesFromAlbumAreIdentical) {
      occurrence.field.push('track_name')
      occurrence.value.push(row.track_name)
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(defaultErrorType)
    }

    if (occurrence.field.length > 0) occurrences.push(occurrence)
  })

  return occurrences
}

module.exports = filter
