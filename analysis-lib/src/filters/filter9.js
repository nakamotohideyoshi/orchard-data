// OST abbreviation

module.exports = function(row, idx) {

  const removeDiacritics = require('../scripts/remove-diacritics');
  const stringUtils = require('../scripts/string-utils');

  const filterName = 'filter9';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const field = 'release_name';
  let value = row[field];
  value = removeDiacritics(value).trim().toLowerCase();

  if(!value) { return false; }

  // No parentheses expression or parentheses are not balanced
  const parensStr = stringUtils.stripParentheses(value);
  if(parensStr.length === 0 || !stringUtils.parenthesesAreBalanced(parensStr)) { return false; }

  // language defaults to english if not specified on tsv file
  let language = removeDiacritics(row['release_meta_language']).trim().toLowerCase();
  language = language || 'english';

  // retrieves genre
  let genre = row['genre'] || row['subgenre'];
  genre = removeDiacritics(genre).trim().toLowerCase();

  const invalidGenres = ['original score', 'soundtrack', 'musicals',
                       'musical', 'video game', 'tv soundtrack'];

  // nothing to be tested or genre is not soundtrack or not related to score
  if(!genre || invalidGenres.indexOf(genre) === -1) { return false; }

  const patterns = {
    'english': /O\,?\.?S\,?\.?T\,?\.?/gi,

    //TODO: research portuguese keywords
    'portuguese': []
  };

  // language not supported
  if(!(language in patterns)) { return false; }

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

  // retrieves value inside parentheses
  const parenthesesValue = stringUtils.getTextBetweenParentheses(value);

  // if it's a match, pushes occurrence
  if(patterns[language].test(parenthesesValue)) {

    occurrence.field.push(field);
    occurrence.value.push(row[field]);
    occurrence.explanation_id.push(defaultExplanationId);
    occurrence.error_type.push(defaultErrorType);

  }

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) { return occurrence; }

  else { return false; }

};
