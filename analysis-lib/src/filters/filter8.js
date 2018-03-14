// filter: Soundtracks and scores must include version information in the album title

module.exports = function(row, idx) {

  const removeDiacritics = require('../scripts/remove-diacritics');
  const parenthesesModule = require('../scripts/parentheses-module');

  const filterName = 'filter8';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const field = 'release_name';
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

  const patterns = {
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

  // language not supported
  if(!language in patterns) { return false; }

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

  const parensStr = parenthesesModule.stripParentheses(value);

  // No parentheses on release name or parentheses are not normalized
  if(parensStr.length === 0 || !parenthesesModule.parenthesesAreBalanced(parensStr)) {

    occurrence.field.push(field);
    occurrence.value.push(row[field]);
    occurrence.explanation_id.push(defaultExplanationId);
    occurrence.error_type.push(defaultErrorType);

  }

  else {

    // retrieves value inside parentheses
    const parenthesesValue = parenthesesModule.getTextInBetween(value);

    // tests each regex
    let match = false;
    patterns[language].forEach(regExp => {

      if(regExp.test(parenthesesValue)) { match = true; }

    });

    // if required values were not found, reports occurrence
    if(!match) {

      occurrence.field.push(field);
      occurrence.value.push(row[field]);
      occurrence.explanation_id.push(defaultExplanationId);
      occurrence.error_type.push(defaultErrorType);

    }

  }

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) { return occurrence; }

  else { return false; }

};
