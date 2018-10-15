'use strict'

const filterName = require('path').parse(__filename).name
const filterMeta = require('./filters-meta')[filterName]

/** @type {string[]} */
const error = filterMeta['type']
const warning = 'warning'
const defaultExplanationId = 'default'
const capitalizationExplanationId = 'capitalization'

/**
 * For tracks using "Meets" or "vs.," all artists involved must be listed at the track level and identified as Primary.
 * The terms "Meets" and "vs." must only appear in the track title.
 * Capitalization of Meets and vs. in a track title does not match.
 *
 * Fields evaluated: Track Name, Track Artist, Track Artist(s) Featuring(s), Track Artist(s) Remixer(s)
 *
 * @param {Object} row
 * @param {Number} idx
 */
const filter = (row, idx) => {
  const occurrence = {
    row_id: idx,
    field: [],
    value: [],
    explanation_id: [],
    error_type: []
  }

  /** @type {string} */
  const trackTitle = row.track_name

  // There is no failure unless there exists a parenthesized expression in the track title.

  const thereExistsAParenthesizedExpression = (trackTitle.search(/\(([^)]+)\)/) !== -1)

  if (!thereExistsAParenthesizedExpression) return false

  // There is a failure if a parenthesized expression in the track title contains a case-insensitive match
  // for "vs." or "Meets", but not a case-sensitive match. The error message would be the second one below,
  // that begins with "capitalization." This failure is a warning. Do not stop processing but continue to see
  // if other failure conditions are met.

  const containsACaseInsensitiveMatch =
    trackTitle.search(/\b(vs\.|Meets\b)/gi) !== -1

  const containsACaseSensitiveMatch =
    trackTitle.search(/\b(vs\.|Meets\b)/g) !== -1

  if (containsACaseInsensitiveMatch && !containsACaseSensitiveMatch) {
    occurrence.field.push('track_name')
    occurrence.value.push(row.track_name)
    occurrence.explanation_id.push(capitalizationExplanationId)
    occurrence.error_type.push(warning)
  }

  // There is a failure if that expression as a whole appears in in any track-level artist field. This is an error.

  const trackLevelArtistFields = [
    'track_artist',
    'track_artist_featuring',
    'track_artist_remixer'
  ]

  trackLevelArtistFields.forEach(trackLevelArtistField => {
    if (!row[trackLevelArtistField]) return

    const containExpression =
      row[trackLevelArtistField].search(/\b(vs\.|Meets\b)/gi) !== -1

    if (containExpression) {
      occurrence.field.push(trackLevelArtistField)
      occurrence.value.push(row[trackLevelArtistField])
      occurrence.explanation_id.push(defaultExplanationId)
      occurrence.error_type.push(error)
    }
  })

  // Split the parenthesized expression on "vs." or "meets", with leading and trailing whitespace trimmed.
  // It is a failure if neither (A|B) or (B|A), pipe-delimited, is the primary track artist.
  // For a track titled "Lorem (first meets second) Ipsum" or "Lorem (first vs second) Ipsum",
  // the primary track artist must be literally first|second or second|first. This failure is an error.

  const parenthesizedExpressionsOnTrackTitle = trackTitle.match(/\(([^)]+)\)/gi)

  if (parenthesizedExpressionsOnTrackTitle.length) {
    parenthesizedExpressionsOnTrackTitle.forEach(expression => {
      const trackTitleContainsExpression = expression.search(/\b(vs\.|Meets\b)/gi) !== -1

      if (trackTitleContainsExpression) {
        const expressionWithoutParenthesis = expression.replace('(', '').replace(')', '')

        const expressionSplit = expressionWithoutParenthesis.split(/\b(vs\.|Meets\b)/gi).map(arrayElement => arrayElement.trim())

        if (expressionSplit.length === 3) {
          const [firstArtist, /* VsOrMeetExpression */, secondArtist] = expressionSplit

          const expectedTrackArtistsFormats = [
            `${firstArtist}|${secondArtist}`,
            `${secondArtist}|${firstArtist}`
          ]

          const trackArtistFieldHasNotBeenReportedYet = !occurrence.field.includes('track_artist')

          const trackArtistFieldDoesNotMeetRequiredFormat = !expectedTrackArtistsFormats.includes(row.track_artist)

          if (trackArtistFieldHasNotBeenReportedYet && trackArtistFieldDoesNotMeetRequiredFormat) {
            occurrence.field.push('track_artist')
            occurrence.value.push(row.track_artist)
            occurrence.explanation_id.push(defaultExplanationId)
            occurrence.error_type.push(error)
          }
        }
      }
    })
  }

  return occurrence.field.length > 0 ? occurrence : false
}

module.exports = filter
