// Get Various Artists count

module.exports = function (dataset) {
  'use strict'

  const patterns = {
    'english': [
      /(^various artists$)/gi,
      /(^v\/a$)/gi,
      /(^v.a$)/gi,
      /(^various$)/gi,
      /(^various artist$)/gi,
      /(^varios$)/gi
    ],

    'portuguese': [
      /(^vários intérpretes$)/gi,
      /(^v\/i$)/gi,
      /(^v.i$)/gi,
      /(^vários$)/gi,
      /(^vários intérprete$)/gi
    ],

    'spanish': [
      /(^varios artistas$)/g,
      /(^v\/a$)/gi,
      /(^v.a$)/gi,
      /(^varios$)/gi,
      /(^varios artista$)/gi
    ]
  }
  let count = 0

  dataset.forEach((row) => {
    const releaseLanguage = row['release_meta_language'] ? row['release_meta_language'].trim().toLowerCase() : 'english'
    const primaryArtist = row['release_artists_primary_artist'] ? row['release_artists_primary_artist'].trim().toLowerCase() : ''

    const langPatterns = patterns[releaseLanguage]

    for (let i = 0; i < langPatterns.length; i++) {
      let regExp = langPatterns[i]

      if (primaryArtist.match(regExp)) {
        count++
        break
      }
    }
  })

  return count / dataset.length
}
