// Check Various Artists on Track Levels

module.exports = function(row, idx, report) {

  // retrieves filter description
  var filterName = 'filter1';
  var removeDiacritics = require('../scripts/remove-diacritics');

  // Captures all strings related to 'Track Artists'
  var filterRegex = /(track\_artist)(_+[a-z A-Z]+)*/i;

  console.log("\n\n");
  console.log(row);
  console.log("\n\n");

  // Iterates over each TSV field
  Object.keys(row).forEach(field => {

    if(filterRegex.test(field)) {

      // Removes diacritics, converts to lowercase and removes trimming
      // whitespaces
      var value = row[field];
      value = removeDiacritics(value);
      value = value.toLowerCase().trim();

      // error condition is met
      if(value === 'various artists') {

        var occurrence = {
          'rowId': idx,
          'field': field,
          'value': row[field]
        };

        // stores error occurrence in filter report
        report.addOccurrence(filterName, occurrence);

      }

    }

  });

  return true;

};
