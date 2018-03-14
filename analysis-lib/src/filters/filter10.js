// Additional information

module.exports = function(row, idx) {

  const removeDiacritics = require('../scripts/remove-diacritics');
  const stringUtils = require('../scripts/string-utils');

  const filterName = 'filter10';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const fields = ['track_name', 'release_name'];
  let trackArtist = row['track_artist'];

  trackArtist = removeDiacritics(trackArtist).trim().toLowerCase();

  // language defaults to english if not specified on tsv file
  let language = removeDiacritics(row['release_meta_language']).trim().toLowerCase();
  language = language || 'english';

  const yearPattern = /\([0-9]{4}\)/;

  const patterns = {
    'english': [
      /Album/gi,
      /[0-9]+\./gi,
      /Produced *By/gi,
      /(\(?|\[?)Exclusive(\)?\]?)/gi,
      /- *Exclusive/gi,
      /(\(?|\[?)Limited Edition(\)?\]?)/gi,
      /- *Limited Edition/gi,
    ],

    'portuguese': [
      /Album/gi,
      /[0-9]+\./gi,
      /Produzido *Por/gi,
      /(\(?|\[?)Exclusivo(\)?\]?)/gi,
      /- *Exclusivo/gi,
      /(\(?|\[?)Edicao Limitada(\)?\]?)/gi,
      /- *Edicao Limitada/gi,
    ]
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

  fields.forEach(field => {

    let value = row[field];

    if(value) {

      value = removeDiacritics(value).trim().toLowerCase();

      // artist appears on release or
      if(value.split('-')[0].search(trackArtist) !== -1) {

        occurrence.field.push(field);
        occurrence.value.push(row[field]);
        occurrence.explanation_id.push(defaultExplanationId);
        occurrence.error_type.push(defaultErrorType);

      }

      // year inside parenthesis
      if(yearPattern.test(value)) {

        occurrence.field.push(field);
        occurrence.value.push(row[field]);
        occurrence.explanation_id.push(defaultExplanationId);
        occurrence.error_type.push('warning');

      }

      for(let i = 0; i < patterns[language].length; i++) {

        // tests invalid patterns
        const regExp = patterns[language][i];

        if(regExp.test(value)) {

          occurrence.field.push(field);
          occurrence.value.push(row[field]);
          occurrence.explanation_id.push(defaultExplanationId);
          occurrence.error_type.push(defaultErrorType);

          break;

        }

      };

    }

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) { return occurrence; }

  else { return false; }

};
