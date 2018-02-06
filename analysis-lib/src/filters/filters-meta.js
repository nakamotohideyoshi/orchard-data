module.exports = {
  // Check Various Artists on Track Levels
  'filter1': {
    'orchardDescription': `Artist Errors: Various Artists on Track Levels / vice versa`,
    'programmerDescription': `The artist for a track can't be "Various Artists." VA can only be for an album.`,
    'userExplanation': `"Various Artists" can't be used at the track level.`,
    'category': 'iTunes'
  },
  'filter2': {
    'orchardDescription': `Artist name cannot include any additional info (Like their instrument, etc)`,
    'programmerDescription': `2.4. Additional Information. The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on." Incorrect: 'Joe Satriani (Guitarist)', 'Johann Sebastian Bach (1685-1750).`,
    'userExplanation': `The artist name must not include any additional information, such as role, date, instrument, former band, website, and so on.`,
    'category': 'iTunes'
  },
};
