module.exports = {
  // Check Various Artists on Track Levels
  'filter1': {
    'orchardDescription': `Artist Errors: Various Artists on Track Levels / vice versa`,
    'programmerDescription': `The artist for a track can't be "Various Artists." VA can only be for an album.`,
    'userExplanation': `"Various Artists" can't be used at the track level.`,
    'category': 'iTunes',
    'type': 'error'
  },
  'filter2': {
    'orchardDescription': `Artist name cannot include any additional info (Like their instrument, etc)`,
    'programmerDescription': `2.4. Additional Information. The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on." Incorrect: 'Joe Satriani (Guitarist)', 'Johann Sebastian Bach (1685-1750).`,
    'userExplanation': `The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on.`,
    'category': 'iTunes',
    'type': 'warning'
  },
  'filter3': {
    'orchardDescription': `Release name must not be generic (e.g., 00s Best Hits)`,
    'programmerDescription': `Release name must not be generic (e.g., 00s Best Hits)`,
    'userExplanation': `Release name must not be generic (e.g., 00s Best Hits)`,
    'category': 'risk',
    'type': 'warning'
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
    'type': 'error'
  },
  'filter5': {
    'orchardDescription': `Artists names must not be generic (e.g., 00s Best Hits)`,
    'programmerDescription': `It is a warning if "Release Artist(s)-Primary Artist(s)" contains any of the following: Yoga, Workout, Meditation, Baby, Christmas, Top Hits, Chorus, Orchestra, Singer, or Cast`,
    'userExplanation': `Generic artists (such as such as Yoga, Workout, Meditation, Baby, Christmas, Top Hits, Chorus, Orchestra, or Singer) are not accepted.
    `,
    'category': 'iTunes',
    'type': 'warning'
  },
};
