// filter: Generic titles( Cannot be Instrument or Track N )

module.exports = function(row, idx, report) {
  'use strict';

  const removeDiacritics = require('../scripts/remove-diacritics');

  const filterName = 'filter15';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const releaseLanguage = row['release_meta_language'].trim().toLowerCase();
  const trackName = removeDiacritics(row['track_name']).trim().toLowerCase();

  const patterns = {
    'english': [
      /(^instrumental$)/gi,
      /(^track [0-9]{1,}$)/gi,
    ],

    'portuguese': [
      /(^instrumental$)/gi,
      /(^faixa [0-9]{1,}$)/gi,
    ],

    'spanish': [
      /(^instrumental$)/gi,
      /(^pista [0-9]{1,}$)/gi,
    ],
  };

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

  let isInvalid = false;
  const langPatterns = patterns[releaseLanguage];

  for (let i = 0; i < langPatterns.length; i ++) {

    let regExp = langPatterns[i];

    if(trackName.match(regExp)) {

      isInvalid = true;
      break;
      
    }

  }
  if (isInvalid) {

    const field = 'track_name';
    occurrence.field.push(field);
    occurrence.value.push(row[field]);
    occurrence.explanation_id.push(defaultExplanationId);
    occurrence.error_type.push(defaultErrorType);

    return occurrence;

  } else {

    return false;

  }
  
};
