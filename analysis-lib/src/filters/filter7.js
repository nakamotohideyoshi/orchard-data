// Composer as artist

module.exports = function(row, idx, report) {

  let removeDiacritics = require('../scripts/remove-diacritics');
  let parenthesesModule = require('../scripts/parentheses-module');

  let filterName = 'filter7';
  let fields = ['release_name', 'track_name'];

  let invalidStrings = [
    /Album Version/gi,
    /Original Version/gi,
    /Previously Unreleased/gi,
    /Reissue/gi,
    /Original Mix/gi,
    /iTunes LP Version/gi,
    /Clean Version/gi,
    /Explicit Version/gi,
    /Mastered for iTunes/gi
  ];

  let occurrence = {
    'rowId': idx,
    'field': [],
    'value': []
  };

  let openTokens = "({[";
  let closeTokens = ")]}";

  fields.forEach(field => {

    let value = row[field].trim();

    // field is not null
    if(value) {

      value = removeDiacritics(value).trim().toLowerCase();
      let parentheses = parenthesesModule.stripParentheses(value);

      // matching parentheses
      if(parenthesesModule.parenthesesAreBalanced(parentheses)) {

        let lastChar = value[value.length - 1];

        // checks if last char is parentheses
        if(closeTokens.indexOf(lastChar) !== -1) {

          // Get values in parentheses
          let parenthesesValue = parenthesesModule.getTextInBetween(value);

          invalidStrings.forEach(regExp => {

            // Invalid string detected
            if(regExp.test(parenthesesValue)) {

              occurrence.field.push(field);
              occurrence.value.push(row[field]);

            }

          });

        }

      }

    }

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) {

    report.addOccurrence(filterName, occurrence);
    return occurrence;
  }

  else { return false; }

};
