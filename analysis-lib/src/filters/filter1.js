// Check Various Artists on Track Levels

module.exports = function(row, idx, report) {

  const removeDiacritics = require('../scripts/remove-diacritics');

  // retrieves filter description
  const filterName = 'filter1';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const fields = ['track_artist', 'track_artist_featuring'];
  const language = row['release_meta_language'].trim().toLowerCase();

  // Captures invalid field values
  const invalidStrings = {
    'abbreviations':          /^v\/?\.?a\.?$/i,
    'english':                [/^(vario)u?(s)(\,?\.? ?(artist)s?)?$/i],
    'portuguese':             [/^(varios)(\-?\,?\.? ?(interpretes)?)?$/i,
                               /^(varios)(\-?\,?\.? ?(artista)(s)?)?$/i],
    'spanish':                [/^(varios)(\-?\,?\.? ?(artista)(s)?)?$/i]
  };

  // language not supported
  if(!(language in invalidStrings)) { return false; }

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

  // If field is related to 'track artists'
  fields.forEach(field => {

    let value = row[field];

    // Only tests if value is non-null
    if(value) {

      const langRegexes = invalidStrings[language];
      const abbrRegExp = invalidStrings["abbreviations"];

      // Removes diacritics and removes trimming whitespaces
      value = value.trim().toLowerCase();
      value = removeDiacritics(value);

      // Abbreviation found
      if(abbrRegExp.test(value)) {

        occurrence.field.push(field);
        occurrence.value.push(row[field]);
        occurrence.explanation_id.push('abbreviation');
        occurrence.error_type.push(defaultErrorType);

      }

      for(let i = 0; i < langRegexes.length; i++) {

        const langRegExp = langRegexes[i];

        // error condition is met
        if(langRegExp.test(value)) {

          occurrence.field.push(field);
          occurrence.value.push(row[field]);
          occurrence.explanation_id.push(defaultExplanationId);
          occurrence.error_type.push(defaultErrorType);

          // regexes are different. if there is a match, there's no need
          // to test others
          break;

        }

      }

    }

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0){

    report.addOccurrence(filterName, occurrence);
    return occurrence;

  }

  return false;

};
