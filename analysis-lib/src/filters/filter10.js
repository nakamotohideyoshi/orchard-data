// Composer as artist

module.exports = function(row, idx, report) {

  let removeDiacritics = require('../scripts/remove-diacritics');
  let parenthesesModule = require('../scripts/parentheses-module');

  let filterName = 'filter10';

  let fields = ['track_name', 'release_name'];
  let trackArtist = row['track_artist'];

  trackArtist = removeDiacritics(trackArtist).trim().toLowerCase();

  // language defaults to english if not specified on tsv file
  let language = removeDiacritics(row['release_meta_language']).trim().toLowerCase();
  language = language || 'english';

  let patterns = {
    'english': [
      /Album/gi,
      /[0-9]+\./gi,
      /Produced *By/gi,
      /(\(?|\[?)Exclusive(\)?\]?)/gi,
      /- *Exclusive/gi,
      /(\(?|\[?)Limited Edition(\)?\]?)/gi,
      /- *Limited Edition/gi,
      /\([0-9]{4}\)/,
    ],

    'portuguese': [
      /Album/gi,
      /[0-9]+\./gi,
      /Produzido *Por/gi,
      /(\(?|\[?)Exclusivo(\)?\]?)/gi,
      /- *Exclusivo/gi,
      /(\(?|\[?)Edicao Limitada(\)?\]?)/gi,
      /- *Edicao Limitada/gi,
      /\([0-9]{4}\)/,
    ]
  };

  // language not supported
  if(!(language in patterns)) { return false; }

  let occurrence = {
    'rowId': idx,
    'field': [],
    'value': []
  };

  fields.forEach(field => {

    let value = row[field];

    if(value) {

      value = removeDiacritics(value).trim().toLowerCase();

      // artist appears on release or
      if(value.split('-')[0].search(trackArtist) !== -1) {

        occurrence.field.push(field);
        occurrence.value.push(row[field]);

      }

      // tests invalid patterns
      patterns[language].forEach(regExp => {

        if(regExp.test(value)) {

          occurrence.field.push(field);
          occurrence.value.push(row[field]);

        }

      });

    }

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0) {

    report.addOccurrence(filterName, occurrence);
    return occurrence;
  }

  else { return false; }

};
