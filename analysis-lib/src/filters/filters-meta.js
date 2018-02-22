module.exports = {
  // Check Various Artists on Track Levels
  'filter1': {
    'orchardDescription': `Artist Errors: Various Artists on Track Levels / vice versa`,
    'programmerDescription': `The artist for a track can't be "Various Artists." VA can only be for an album.`,
    'userExplanation': `"Various Artists" can't be used at the track level.`,
    'category': 'iTunes',
    'type': 'error',
    'basis': 'row'
  },
  'filter2': {
    'orchardDescription': `Artist name cannot include any additional info (Like their instrument, etc)`,
    'programmerDescription': `2.4. Additional Information. The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on." Incorrect: 'Joe Satriani (Guitarist)', 'Johann Sebastian Bach (1685-1750).`,
    'userExplanation': `The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on.`,
    'category': 'iTunes',
    'type': 'warning',
    'basis': 'row'
  },
  'filter3': {
    'orchardDescription': `Release name must not be generic (e.g., 00s Best Hits)`,
    'programmerDescription': `Release name must not be generic (e.g., 00s Best Hits)`,
    'userExplanation': `Release name must not be generic (e.g., 00s Best Hits)`,
    'category': 'risk',
    'type': 'warning',
    'basis': 'row'
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
    'basis': 'row'
  },
  'filter5': {
    'orchardDescription': `Artists names must not be generic (e.g., 00s Best Hits)`,
    'programmerDescription': `It is a warning if "Release Artist(s)-Primary Artist(s)" contains any of the following: Yoga, Workout, Meditation, Baby, Christmas, Top Hits, Chorus, Orchestra, Singer, or Cast`,
    'userExplanation': `Generic artists (such as such as Yoga, Workout, Meditation, Baby, Christmas, Top Hits, Chorus, Orchestra, or Singer) are not accepted.
    `,
    'category': 'iTunes',
    'type': 'warning',
    'basis': 'row'
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
    'basis': 'dataset'
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
    'basis': 'dataset'
  },
};
