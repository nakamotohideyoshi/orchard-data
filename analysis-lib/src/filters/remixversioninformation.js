'use strict'

const filterId = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

// Definition: Tail
// Let the head of a track title end at either:
// - the first hyphen
// - the first parenthesis or square bracket after which there is no text not in parentheses or square brackets
// So with the track title '(lorem) ipsum (dolor)[sit]', the tail is '(dolor)[sit]', and with the track title 'lorem (ipsum) dolor' there is no tail.
// Then the *tail* is any text after the head.

/**
 * @param {string} trackTitle
 */
const extractTrackTitleHead = (trackTitle) => {
  const firstHyphenPosition = trackTitle.indexOf(' - ')
  const lastParenthesis = trackTitle.lastIndexOf(' (')
  const lastSquareBracket = trackTitle.lastIndexOf(' [')
  const lastChar = trackTitle.charAt(trackTitle.length - 1)
  let trackTitleHeadEndIndex = trackTitle.length

  if (firstHyphenPosition !== -1) {
    trackTitleHeadEndIndex = firstHyphenPosition
  } else if (lastChar === ')' || lastChar === ']') {
    if (lastParenthesis !== -1 && lastSquareBracket !== -1) {
      trackTitleHeadEndIndex = (lastParenthesis < lastSquareBracket ? lastParenthesis : lastSquareBracket)
    } else if (lastParenthesis !== -1) {
      trackTitleHeadEndIndex = lastParenthesis
    } else if (lastSquareBracket !== -1) {
      trackTitleHeadEndIndex = lastSquareBracket
    }
  }

  return trackTitle.substring(0, trackTitleHeadEndIndex)
}

/**
 * @param {string} trackTitle
 */
const extractTrackTitleTail = (trackTitle) => {
  const trackTitleHead = extractTrackTitleHead(trackTitle)
  const trackTitleTail = trackTitle.replace(trackTitleHead, '')
  return trackTitleTail
}

//  Definition: Remix flag
//  - A remix flag on a track is set if the tail contains any of the words "remix", "mix", "remixed", "mixed", delimited by word separators, case insensitive.
//  - A remix flag on a track is set if the "Track Artist(s) - Remixer(s)" field is not blank.
//  Note: we assume the track-level remixer will always be set, even if the album-level remixer is also set.

/**
 * @param {Object} track
 */
const checkIfTrackHasRemixFlag = (track) => {
  const trackArtistRemixer = track.track_artist_remixer

  if (trackArtistRemixer) return true

  if (!track.track_name) return false

  const trackTitle = track.track_name

  const trackTitleTail = extractTrackTitleTail(trackTitle)

  const searchExpression = /\b(mix|remix|remixed|mixed)\b/gi

  if (trackTitleTail.search(searchExpression) !== -1) return true

  return false
}

/**
 * @param {Array} dataset
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = function (dataset) {
  const occurrences = []

  // A dataset can contain several different album, so we need to group the albums before.
  // Albums are grouped when they have the same 'release name' and 'release artist - primary'.

  const albumsOnThisDataset = []

  dataset.forEach((row) => {
    const groupName = `${row.release_name} by ${row.release_artists_primary_artist}`
    if (albumsOnThisDataset[groupName]) {
      albumsOnThisDataset[groupName].push(row)
    } else {
      albumsOnThisDataset[groupName] = [row]
    }
  })
  const groupNames = Object.keys(albumsOnThisDataset)

  groupNames.forEach((groupName) => {
    const albumRows = albumsOnThisDataset[groupName]

    //  Rule: Original song
    //  - If every track on an album has the same head, let the "original song" be the head.

    let everyTrackOnAnAlbumHasTheSameHead = true
    let lastCheckedTrackTitleHead
    let theOriginalSong

    albumRows.forEach((row) => {
      const trackTitle = row.track_name
      const currentTrackTitleHead = extractTrackTitleHead(trackTitle)

      if (lastCheckedTrackTitleHead && lastCheckedTrackTitleHead !== currentTrackTitleHead) {
        everyTrackOnAnAlbumHasTheSameHead = false
      }

      lastCheckedTrackTitleHead = theOriginalSong = currentTrackTitleHead
    })

    if (!everyTrackOnAnAlbumHasTheSameHead) {
      theOriginalSong = null
    }

    // Definition: Remix album
    // - A song is a remix of the original song if the remix flag is set and the title contains the original song.

    const checkIfSongIsARemixOfTheOriginalSong = (track) => {
      if (!theOriginalSong) return false
      const trackHasRemixFlag = checkIfTrackHasRemixFlag(track)
      let trackTitleContainsTheOriginalSong = (track.track_name.indexOf(theOriginalSong) !== -1)
      return (trackHasRemixFlag && trackTitleContainsTheOriginalSong)
    }

    // Rule: Remix album
    // - If every track on an album is either the original song or a remix of the original song, the album is a remix album.

    let isARemixAlbum = true

    albumRows.forEach((row) => {
      const songIsTheOriginalSong = (row.track_name === theOriginalSong)
      const songIsARemixOfTheOriginalSong = checkIfSongIsARemixOfTheOriginalSong(row)

      if (!songIsTheOriginalSong && !songIsARemixOfTheOriginalSong) {
        isARemixAlbum = false
      }
    })

    albumRows.forEach((row, index) => {
      const occurrence = {
        'row_id': index + 1,
        'dataset_row_id': row.rowid,
        'field': [],
        'value': [],
        'explanation_id': [],
        'error_type': []
      }

      let twoOrMoreTrackTitlesFromAlbumAreIdentical = false

      // TEST 1. If there is a remix album, and the release name does not contain the original song, it is an error.

      const releaseNameDoesNotContainTheOriginalSong = (row.release_name.search(new RegExp(theOriginalSong, 'gi')) === -1)

      if (isARemixAlbum && releaseNameDoesNotContainTheOriginalSong) {
        occurrence.field.push('release_name')
        occurrence.value.push(row.release_name)
        occurrence.explanation_id.push(defaultExplanationId)
        occurrence.error_type.push(defaultErrorType)
      }

      // TEST 2. If there is an original song for the release, and any two track titles on that release are identical, it is an error.

      if (theOriginalSong) {
        for (let i = 0, l = albumRows.length; i < l; i++) {
          if (i === index) continue // Don't compare row with itself.

          if (albumRows[i].track_name === row.track_name) {
            twoOrMoreTrackTitlesFromAlbumAreIdentical = true
            break
          }
        }

        if (twoOrMoreTrackTitlesFromAlbumAreIdentical) {
          occurrence.field.push('track_name')
          occurrence.value.push(row.track_name)
          occurrence.explanation_id.push(defaultExplanationId)
          occurrence.error_type.push(defaultErrorType)
        }
      }

      if (occurrence.field.length > 0) occurrences.push(occurrence)
    })
  })

  return occurrences
}
