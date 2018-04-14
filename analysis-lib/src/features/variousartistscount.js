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
      /(^varios artistas$)/gi,
      /(^v\/a$)/gi,
      /(^v.a$)/gi,
      /(^varios$)/gi,
      /(^varios artista$)/gi
    ]
  }
  let count = 0

  if (dataset.length !== 0) {
    // if there is exist dataset, calcuate va-count.

    const releaseLanguage = dataset[0]['release_meta_language'] ? dataset[0]['release_meta_language'].trim().toLowerCase() : 'english'

    if (releaseLanguage in patterns) {
      // language support

      dataset.forEach((row) => {
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
    }
  }

  return count / dataset.length
}
