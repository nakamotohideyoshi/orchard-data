const filterId = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const [
  meetsMustBeCapitalized,
  vsMustBeCapitalized,
  vsMustBeWrittenExactlyLikeThat,
  artistsMustBeIdentifiedAsPrimary
] = Object.keys(filterMeta['explanations'])

/**
 * @param {Object} row
 * @param {number} index
 * @param {Array} dataset
 * @returns {{row_id: number, field: array, value: array, explanation_id: array, error_type: array}|boolean}
 */
module.exports = dataset => {
  const occurrences = []

  dataset.forEach((row, index) => {
    const occurrence = {
      row_id: index + 1,
      dataset_row_id: row.rowid,
      field: [],
      value: [],
      explanation_id: [],
      error_type: []
    }

    /** @type {string} */
    const albumTitle = row.release_name

    // If album title is not set, returns, as there won't be errors anyway.

    if (!albumTitle) return

    // If the album title does not contain "meets" or "vs", case-insensitive, there is no error.

    const albumTitleDoesNotContainMeetsOrVs =
      albumTitle.search(/\b(meets|vs)\b/i) === -1

    if (albumTitleDoesNotContainMeetsOrVs) return

    // If the album title does contain a case-insensitive whole-word match for "Meets" but not a case-sensitive
    // match, there is an error. The message is "Meets" must be capitalized just like that.

    const albumTitleContainsCaseInsensitiveMeets =
      albumTitle.search(/\b(meets)\b/i) !== -1

    const albumTitleContainsCaseSensitiveMeets =
      albumTitle.search(/\b(Meets)\b/) !== -1

    if (
      albumTitleContainsCaseInsensitiveMeets &&
      !albumTitleContainsCaseSensitiveMeets
    ) {
      occurrence.field.push('release_name')
      occurrence.value.push(row.release_name)
      occurrence.explanation_id.push(meetsMustBeCapitalized)
      occurrence.error_type.push(defaultErrorType)
    }

    // If the album title does contain a case-insensitive whole-word match (with word delimiters) for "vs." but
    // not a case-sensitive match, there is an error. The message is "vs." must be capitalized just like that.

    const albumTitleContainsCaseInsensitiveVsWithDot =
      albumTitle.search(/\b(vs)\./i) !== -1

    const albumTitleContainsCaseSensitiveVsWithDot =
      albumTitle.search(/\b(vs)\./) !== -1

    if (
      albumTitleContainsCaseInsensitiveVsWithDot &&
      !albumTitleContainsCaseSensitiveVsWithDot
    ) {
      occurrence.field.push('release_name')
      occurrence.value.push(row.release_name)
      occurrence.explanation_id.push(vsMustBeCapitalized)
      occurrence.error_type.push(defaultErrorType)
    }

    // If the album title does contain a case-insensitive whole-word match for "vs" (no dot) but not for
    // "vs." (with a dot), there is an error. The message is "vs." must be written exactly like that.

    const albumTitleContainsCaseInsensitiveVsWithoutDot =
      albumTitle.search(/\b(vs)\b/i) !== -1

    if (
      albumTitleContainsCaseInsensitiveVsWithoutDot &&
      !albumTitleContainsCaseInsensitiveVsWithDot
    ) {
      occurrence.field.push('release_name')
      occurrence.value.push(row.release_name)
      occurrence.explanation_id.push(vsMustBeWrittenExactlyLikeThat)
      occurrence.error_type.push(defaultErrorType)
    }

    // If the album title contains a case-sensitive whole-word match for Meets or vs., use that as a delimiter,
    // split the string, and trim whitespace from the segments. If the primary album artist is not "Part A",
    // "Part B", "Part A | Part B", or "Part B | Part A", there is an error. (Whitespace around the pipe delimiter
    //  is optional). The message is "When “Meets” or “vs.” is used to describe an album, either or both artists
    // must be identified as primary at the album level."

    if (
      albumTitleContainsCaseSensitiveMeets ||
      albumTitleContainsCaseSensitiveVsWithDot
    ) {
      const albumTitleSplit = albumTitle
        .split(/\b(Meets\b|vs\.)/)
        .map(element => element.trim())

      if (albumTitleSplit.length >= 3) {
        const [firstArtist /* delimiter */, , secondArtist] = albumTitleSplit
        const primaryAlbumArtist = row.release_artists_primary_artist
        const expectedPrimaryAlbumArtistForms = [
          firstArtist,
          secondArtist,
          `${firstArtist} | ${secondArtist}`,
          `${firstArtist}|${secondArtist}`,
          `${secondArtist} | ${firstArtist}`,
          `${secondArtist}|${firstArtist}`
        ]

        if (!expectedPrimaryAlbumArtistForms.includes(primaryAlbumArtist)) {
          occurrence.field.push('release_artists_primary_artist')
          occurrence.value.push(row.release_artists_primary_artist)
          occurrence.explanation_id.push(artistsMustBeIdentifiedAsPrimary)
          occurrence.error_type.push(defaultErrorType)
        }
      }
    }

    if (occurrence.field.length > 0) occurrences.push(occurrence)
  })

  return occurrences
}
