// Check Various Artists on Track Levels
module.exports = function(row, idx, report) {
  // retrieves filter description
  var filterName = 'filter1';
  var description = require('./filters_desc')[filterName];

  // Converts to lowercase and removes whitespaces
  var trackArtist = row['Track Artist'];
  trackArtist = trackArtist.toLowerCase().trim().replace(' ', '')

  // if filter applies
  if(trackArtist === 'variousartists') {
    report['filters'][filterName]['occurences'].push(idx);
  }

  return true;
}
