// Composer as artist

module.exports = function(row, idx, report) {

  let removeDiacritics = require('../scripts/remove-diacritics');
  let parenthesesModule = require('../scripts/parentheses-module');

  let filterName = 'filter8';

  let field = 'release_name';
  let value = row[field];
  value = removeDiacritics(value).trim().toLowerCase();

  if(!value) { return false; }

  // language defaults to english if not specified on tsv file
  let language = removeDiacritics(row['release_meta_language']).trim().toLowerCase();
  language = language || 'english';

  // retrieves genre
  let genre = row['genre'] || row['subgenre'];
  genre = removeDiacritics(genre).trim().toLowerCase();

  // nothing to be tested or genre is not soundtrack or not related to score
  if(!genre || (genre !== 'soundtrack' && !/Score/gi.test(genre))) { return false; }

  let patterns = {
    'english': [
      /Soundtrack/gi,
      /Original Score/gi,
      /Music Inspired By/gi,
      /Original/gi,
      /Cast/gi,
      /Music From/gi
    ],

    //TODO: research portuguese keywords
    'portuguese': []
  };

  let occurrence = {
    'rowId': idx,
    'field': [],
    'value': []
  };

  let parensStr = parenthesesModule.stripParentheses(value);

  // No parentheses on release name or parentheses are not normalized
  if(parensStr.length === 0 || !parenthesesModule.parenthesesAreBalanced(parensStr)) {

    occurrence.field.push(field);
    occurrence.value.push(row[field]);

  }

  else {

    // retrieves value inside parentheses
    let parenthesesValue = parenthesesModule.getTextInBetween(value);

    // tests each regex
    let match = false;
    patterns[language].forEach(regExp => {

      if(regExp.test(parenthesesValue)) { match = true; }

    });

    // if required values were not found, reports occurrence
    if(!match) {

      occurrence.field.push(field);
      occurrence.value.push(row[field]);

    }

  }

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) {

    report.addOccurrence(filterName, occurrence);
    return occurrence;
  }

  else { return false; }

};
