// Check Various Artists on Track Levels

module.exports = function(row, idx, report) {

  // retrieves filter description
  let filterName = 'filter1';
  let removeDiacritics = require('../scripts/remove-diacritics');

  // Captures all fields related to 'Track Artists'
  let fieldRegex = /(track\_artist)(_+[a-z A-Z]+)*/i;

  // Captures invalid field values
  let abbreviationsRegex = /v\/?\.?a.?/i;
  let vaRegex = /(vario)u?(s)\,?\.?( (artist)s?)?/i;

  // Iterates over each TSV field
  Object.keys(row).forEach(field => {

    if(fieldRegex.test(field)) {

      // Removes diacritics, converts to lowercase and removes trimming
      // whitespaces
      var value = row[field];
      value = removeDiacritics(value);
      value = value.toLowerCase().trim();

      // Various Artists is illegal unless the value of the field
      // "Track Artist(s) - Remixer(s)" is non-null,
      // or the value of the field "Version" contains "mix".
      if(row['track_artist_remixer'] || row['version'].toLowerCase() === 'mix') {}

      else {

        // error condition is met
        if(abbreviationsRegex.test(value) || vaRegex.test(value)) {

          var occurrence = {
            'rowId': idx,
            'field': field,
            'value': row[field]
          };

          // stores error occurrence in filter report
          report.addOccurrence(filterName, occurrence);

        }

      }

    }

  });

  return true;

};
