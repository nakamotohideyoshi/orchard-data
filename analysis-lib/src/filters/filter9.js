// Composer as artist

module.exports = function(row, idx, report) {

  let removeDiacritics = require('../scripts/remove-diacritics');
  let parenthesesModule = require('../scripts/parentheses-module');

  let filterName = 'filter9';

  let field = 'release_name';
  let value = row[field];
  value = removeDiacritics(value).trim().toLowerCase();

  if(!value) { return false; }

  // No parentheses expression or parentheses are not balanced
  let parensStr = parenthesesModule.stripParentheses(value);
  if(parensStr.length === 0 || !parenthesesModule.parenthesesAreBalanced(parensStr)) { return false; }

  // language defaults to english if not specified on tsv file
  let language = removeDiacritics(row['release_meta_language']).trim().toLowerCase();
  language = language || 'english';

  // retrieves genre
  let genre = row['genre'] || row['subgenre'];
  genre = removeDiacritics(genre).trim().toLowerCase();

  let invalidGenres = ['original score', 'soundtrack', 'musicals',
                       'musical', 'video game', 'tv soundtrack'];

  // nothing to be tested or genre is not soundtrack or not related to score
  if(!genre || invalidGenres.indexOf(genre) === -1) { return false; }

  let patterns = {
    'english': /O\,?\.?S\,?\.?T\,?\.?/gi,

    //TODO: research portuguese keywords
    'portuguese': []
  };

  // language not supported
  if(!(language in patterns)) { return false; }

  let occurrence = {
    'rowId': idx,
    'field': [],
    'value': []
  };

  // retrieves value inside parentheses
  let parenthesesValue = parenthesesModule.getTextInBetween(value);

  // if it's a match, pushes occurrence
  if(patterns[language].test(parenthesesValue)) {

    occurrence.field.push(field);
    occurrence.value.push(row[field]);

  }

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) {

    report.addOccurrence(filterName, occurrence);
    return occurrence;
  }

  else { return false; }

};
