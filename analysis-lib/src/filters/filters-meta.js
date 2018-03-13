module.exports = {

  // Check Various Artists on Track Levels
  'filter1': {
    'orchardDescription': `Artist Errors: Various Artists on Track Levels / vice versa`,
    'programmerDescription': `The artist for a track can't be "Various Artists." VA can only be for an album.`,
    'userExplanation': `"Various Artists" can't be used at the track level.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `Artist Errors: Various Artists on Track Levels / vice versa`,
      'abbreviation': 'Various artists abbreviation found'
    }
  },

  'filter2': {
    'orchardDescription': `Artist name cannot include any additional info (Like their instrument, etc)`,
    'programmerDescription': `2.4. Additional Information. The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on." Incorrect: 'Joe Satriani (Guitarist)', 'Johann Sebastian Bach (1685-1750).`,
    'userExplanation': `The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on.`,
    'category': 'iTunes',
    'type': 'warning',
    'basis': 'row',
    'explanations': {
      'default': `Artist name cannot include any additional info (Like their instrument, etc)`,
    }
  },

  'filter3': {
    'orchardDescription': `Release name must not be generic (e.g., 00s Best Hits)`,
    'programmerDescription': `Release name must not be generic (e.g., 00s Best Hits)`,
    'userExplanation': `Release name must not be generic (e.g., 00s Best Hits)`,
    'category': 'risk',
    'type': 'warning',
    'basis': 'row',
    'explanations': {
      'default': `Release name must not be generic (e.g., 00s Best Hits)`,
    }
  },

  'filter4': {
    'orchardDescription': `Artist Name formatting (cannot be Last, First)`,
    'programmerDescription': `Terminate test if there is no comma in artist name (e.g., The Beatles)

                              Terminate test if the Language is English and any word is:
                              & (e.g., Earth, Wind & Fire)
                              and (e.g., Emerson, Lake and Palmer)
                              band, quartet, sextet, trio, orchestra, choir
                              the (e.g., "Beatles, The")

                              Terminate test if there is more than one comma in artist name. (e.g., Andršt, Luboš , Group)

                              Terminate test if there are more than three words. (e.g., Soul Gun Warriors , U-Mass)`,
    'userExplanation': `An artist name must not be in "Last, First" format.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `Artist Name formatting (cannot be Last, First)`,
    }
  },

  'filter5': {
    'orchardDescription': `Artists names must not be generic (e.g., 00s Best Hits)`,
    'programmerDescription': `It is a warning if "Release Artist(s)-Primary Artist(s)" contains any of the following: Yoga, Workout, Meditation, Baby, Christmas, Top Hits, Chorus, Orchestra, Singer, or Cast`,
    'userExplanation': `Generic artists (such as such as Yoga, Workout, Meditation, Baby, Christmas, Top Hits, Chorus, Orchestra, or Singer) are not accepted.
    `,
    'category': 'iTunes',
    'type': 'warning',
    'basis': 'row',
    'explanations': {
      'default': `Artists names must not be generic (e.g., 00s Best Hits)`,
    }
  },

  'filter6': {
    'orchardDescription': `Composer cannot be listed as primary artist`,
    'programmerDescription': `Let release artist = both "Orchard Artist" and
      "Release Artist(s)-Primary Artist(s)")

      If release artist is the same as (release_artists_composer or any
      track_artist_composer) and genre is not classical or soundtrack, it is an error.

      If release artist is the same as (release_artists_composer or any
      track_artist_composer) and there is more than one value for
      track_artist_composer, it is an error.

      If genre is soundtrack and there is one composer for "Track Artist(s)
      - Composer(s)" across all tracks in the release, Orchard Artist and Release
      Artist(s)-Primary Artist(s) must be the composer.`,
    'userExplanation': `The composer cannot be listed as primary artist. Refer to iTunes style guide 2.3, 4.4 or 24.4`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'dataset',
    'explanations': {
      'default': `Composer cannot be listed as primary artist`,
      'notClassical': `Composer is listed as primary artist and genre is not classical`,
      'multipleComposers': `Artist cannot be listed as composer if there are multiple composers at track level`,
      'soundtrack': `If genre is soundtrack and there is only one composer at track level, Orchard Artist and Release Artist(s)-Primary Artist(s) must be the composer`,
    }
  },

  'filter7': {
    'orchardDescription': `Track/Album versions that aren’t allowed`,
    'programmerDescription': `

      If there are matching parenthesis or square brackets, there is no error
      If the following text occurs in the parenthesis or square brackets, there is an error.

      Album Version
      Original Version
      Previously Unreleased
      Reissue
      Original Mix
      iTunes LP Version
      Clean Version
      Explicit Version
      Mastered for iTunes

      A warning to the programmer: there can be two of these strings, first
      parens and then in square brackets, like "Lorem (ipsum)[dolor]."

    `,
    'userExplanation': `This type of content version (in parens) is not permitted.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `This type of content version (in parens) is not permitted.`,
    }
  },

  'filter8': {
    'orchardDescription': `Soundtracks and scores must include version information in the album title, enclosed by parentheses or brackets`,
    'programmerDescription': `

      There is no error if genre is not soundtrack or score

      There is an error if release title does not contain an expression in
      parenthesis in parenthesis or square brackets

      There is an error if release title does not contain one of the following:

      Soundtrack
      Original Score
      Music Inspired By
      Original
      Cast
      Music from

    `,
    'userExplanation': `Soundtracks and scores must include version information in the album title.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `Soundtracks and scores must include version information in the album title, enclosed by parentheses or brackets`,
    }
  },

  'filter9': {
    'orchardDescription': `The abbreviation for Original Soundtrack (O.S.T.) should not be used as an album or song title version`,
    'programmerDescription': `

      There is no error if genre is not

      Original Score
      Soundtrack
      Musicals
      Musical
      Video Game
      TV Soundtrack

      There is no error if there is not an expression in parenthesis or square brackets
      There is an error if the expression is O.S.T. or OST

    `,
    'userExplanation': `The abbreviation for Original Soundtrack (O.S.T.) should not be used as an album or song title version for scores, movies, TV, musicals, or video games.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `The abbreviation for Original Soundtrack (O.S.T.) should not be used as an album or song title version`,
    }
  },

  'filter10': {
    'orchardDescription': `Titles including release dates, album name, track number, additional info (producers, single, etc), search terms, artist info`,
    'programmerDescription': `

      It is an error if a release name contains " - Album"
      Example: Dawns Welcome to the Club - Album (feat. Ricky J)

      It is an error if a track name begins with a number followed by a period and subsequent text
      Example: 12. I'll Be Walking Alone in a Crowd

      It is an error if a release name or track title contains the substring "(Produced By [.*])
      Example: Campus Girl (Produced By T.J. Douglas) - Single

      It is an error if a release name or track title is prefixed with the track artist's name and a hyphen
      Example: Aerosmith - Draw the Line

      It is an error if a release name contains "(Exclusive)", "[Exclusive]", or "- Exclusive."
      Example: In Through The Out Door (Exclusive)

      It is an error if a release name contains "(Limited Edition)", "[Limited Edition]", or "- Limited Edition."
      Example: In Through The Out Door - Limited Edition

    `,
    'userExplanation': `Titles may not include release dates, track number, additional info (producers, single, etc), search terms, or artist info.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `Titles may not include release dates, track number, additional info (producers, single, etc), search terms, or artist info.`,
    }
  },

  'filter11': {
    'orchardDescription': `feat. and with must be properly formatted`,
    'programmerDescription': `

      If "Track Artist - Featuring" or "Release Artist - Featuring" are both empty, there is no error.
      Extract any strings in the input fields in parens or square brackets with no text afterward. If there are no matching pairs or there is text after the pair, there is no error.
      Split on word separators. If the first word is:

      "feat." or "with" - case sensitive, there is no error.
      a case-insensitive match for: with, featuring, feat (no terminating '.'), w/
      the Spanish translation of "featuring" or "with"
      the Brazilian Portuguese translation of "featuring" or "with"

      report error.

    `,
    'userExplanation': `Formatting of "feat." and "with" must be lower case, in English, and in parentheses or brackets. See iTunes Store Music Style Guide 5.3.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `Formatting of "feat." and "with" must be lower case, in English, and in parentheses or brackets. See iTunes Store Music Style Guide 5.3.`,
    }
  },

  'filter12': {
    'orchardDescription': `"Live" on Release but not Tracks`,
    'programmerDescription': `

      There is a target string - "Live" in English, ”Ao Vivo” in Portuguese, and
      “En Vivo” or “En Directo” in Spanish. A match for this string is
      case-insensitive, delimited by word separators. The language of the
      dataset and row is ignored - all languages are tested.

      There is version information for a track. It may be in the version field,
      in a parenthesized expression in the track title, or in square brackets in
      the track title.

      There is version information for a release in the release name. It may be
      in a parenthesized expression, or in square brackets, or after a hyphen,
      or the release name may be exactly "Live."

      If version information for a release does not contain the target string, there is no failure.
      Otherwise, if version information for a track does not contain the target
      string, there is a failure.

    `,
    'userExplanation': `If the album title contains "Live", each track must also.`,
    'category': 'risk',
    'type': 'warning',
    'basis': 'row',
    'explanations': {
      'default': `If the album title contains "Live", each track must also.`,
    }
  },

  'filter13': {
    'orchardDescription': `Part and Volume should be abbreviated to Pt. and Vol.`,
    'programmerDescription': `

        If the substring ", Part [integer | roman numeral]" exists in a Release
        Name or Track Title, it is an error.

        If the subtring ", Volume [integer | roman numeral]" exists in a Release
        Name or Track Title, it is an error.

        If "Pt." or "Vol." matches in a case-insensitive way, but not in a
        case-sensitive way, it is an error.

        "Pt" and "Vol" without terminating period are errors

    `,
    'userExplanation': `

      The words Part and Volume must be abbreviated with “Pt.”
      and “Vol.” See iTunes Style Guide 11.2.

    `,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `

        The words Part and Volume must be abbreviated with “Pt.”
        and “Vol.” See iTunes Style Guide 11.2.

      `,
    }
  },

  'filter14': {
    'orchardDescription': `Each artist field must only contain one artist name.`,
    'programmerDescription': `

      If the field does not "&", "+", or "and", there is no error.
      There is no error if the field contains an artist with a direct match in Musicbrainz or Wikipedia
      There is no error if the field contains more than one instance of "&", "+", or "and".
      Split the string on "&", "+", or "and". Search for component as an artist. If both components are found, there is an error.

    `,
    'userExplanation': `Each artist field must only contain one artist name. See iTunes Style Guide 2.8`,
    'category': 'iTunes',
    'type': 'warning',
    'basis': 'row',
    'explanations': {
      'default': `Each artist field must only contain one artist name. See iTunes Style Guide 2.8`,
    }
  },
  'filter15': {
    'orchardDescription': `Generic Titles (Track 1, Track 2)`,
    'programmerDescription': `

      It is an error if a track title is "Instrumental", or if it fits the pattern "Track N", where N is an integeger. These are case-insensitive.
    `,
    'userExplanation': `Generic track titles such as "Instrumental", or "Track 1" are not accepted.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row',
    'explanations': {
      'default': `Do not use generic titles, such as Track 1, Track 2, or Instrumental, unless they are the actual titles of the tracks or ringtones. See iTunes Style Guide 3.7`,
    }
  }

};
