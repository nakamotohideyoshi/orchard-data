// Check Various Artists on Track Levels
module.exports = function(row, idx, report) {
  // retrieves filter description
  var filterName = 'filter1';
  var description = require('./filters_desc')[filterName];
  var removeDiacritics = require('../scripts/remove-diacritics');

  // Converts to lowercase and removes whitespaces
  var filterRegex = /(track artist)[a-z A-Z]*/i;

  Object.keys(row).forEach(field => {

    if(filterRegex.test(field)) {
      var value = row[field];
      value = removeDiacritics(value);
      value = value.toLowerCase().trim();

      // if filter applies
      if(value === 'various artists') {
        report['filters'][filterName]['occurs_on'].push(idx);
      }
    }
  });

  return true;
}
