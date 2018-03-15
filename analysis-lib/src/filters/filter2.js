// Additional information

module.exports = function(row, idx) {

  const removeDiacritics = require('../scripts/remove-diacritics');

  // retrieves filter description
  const filterName = 'filter2';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const releaseLanguage = row['release_meta_language'] ? row['release_meta_language'].trim().toLowerCase() : '';

  const fields = [
    'orchard_artist',
    'release_artists_primary_artist',
    'release_artists_featuring',
    'release_artists_remixer',
    'release_artists_composer',
    'release_artists_orchestra',
    'release_artists_ensemble',
    'release_artists_conductor',
    'track_artist',
    'track_artist_featuring',
    'track_artist_remixer',
    'track_artist_composer',
    'track_artist_orchestra',
    'track_artist_ensemble',
    'track_artist_conductor',
  ];

  // Common instruments RegExp
  const instrumentsRegExp = {
    'piano': {
      'english':      /(pian)(o|ist)?(s)?/i,
      'portuguese':   /(pian)(o|ista)?(s)?/i,
      'spanish':      /(pian)(o|ista)?(s)?/i
    },

    'keyboards': {
      'english':      /(keyboard)(s)?/i,
      'portuguese':   /(teclad)(o|ista)?(s)?/i,
      'spanish':      /(teclad)(o|ista)?(s)?/i
    },

    'drums': {
      'english':      /(drum)(s|(m)?er(s)?)?/i,
      'portuguese':   /(bateri)(a|ista(s)?)?/i,
      'spanish':      /(bateri)(a|ista(s)?)?/i
    },

    'guitar': {
      'english':      /(guitar)(s|ist)?(s)?/i,
      'portuguese':   /(guitarr)(a|ista)?(s)?/i,
      'spanish':      /(guitarr)(a|ista)?(s)?/i
    },

    'vocals': {
      'english':      /(((vocal)(s|ist)?(s)?)|(singer(s)?))/i,
      'portuguese':   /(((vocal)(s|ista)?(s)?)|(cantor(a)?(s)?))/i,
      'spanish':      /(((vocal)(s|ista)?(s)?)|(cantor(a)?(s)?)|(cantante(s)?)|(cantador(a)?(s)?))/i
    },

    'bass': {
      'english':      /(bass)(ist)?(s)?/i,
      'portuguese':   /(baix)(o|ista)?(s)?/i,
      'spanish':      /(baj)(o|ista)?(s)?/i
    },
  };

  // Non Latin languages unicode ranges
  const languagesRegExp = {
    'japanese': /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/,
    'chinese':  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/,
    'hebrew':   /[\u0590-\u05FF]/,
    'arabic':   /[\u0600-\u06FF\u0750-\u077F]/,
    'greek':    /[\u0370-\u03FF]/,
    'russian':  /[\u0400-\u04FF]/,
    'thai':     /[\u0E00-\u0E7F]/
  };

  // Years only
  const yearsRegExp = /^([12][0-9]{3})?\-?\/?([12][0-9]{3})?$/;

  // Does not check valid dates, just the digits
  const dateRegExp = [
    // dd/mm/YY
    /^[0-3]?[0-9].(([0-3]?[0-9])|(Jan|Mar|May|Jul|Aug|Oct|Dec)).(?:[0-9]{2})?[0-9]{2}$/i,
    // mm/dd/YY
    /^(([0-3]?[0-9])|(Jan|Mar|May|Jul|Aug|Oct|Dec)).[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/,
    // YY/mm/dd
    /^(?:[0-9]{2})?[0-9]{2}.(([0-3]?[0-9])|(Jan|Mar|May|Jul|Aug|Oct|Dec)).[0-3]?[0-9]$/
  ];

  const parenthesisRegExp = /(\(.*\))|\(|\)/g;

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

  fields.forEach(field => {

    let value = row[field];

    // Only tests if value is non-null
    if(value) {

      // Removes trailling whitespaces and diacritics
      value = value.trim();
      value = removeDiacritics(value);

      // Start Tests
      let match = false;

      // Test parenthesis
      if(parenthesisRegExp.test(value)) { match = true; }

      // Test years
      if(!match && yearsRegExp.test(value)) { match = true; }

      // Test for any date
      if(!match) { dateRegExp.forEach(type => match = type.test(value)); }

      // Test common instruments / roles
      if(!match) {

        Object.keys(instrumentsRegExp).forEach(instrumentId => {

          const instrument = instrumentsRegExp[instrumentId];

          Object.keys(instrument).forEach(language => {

            const instrumentRegExp = instrument[language];
            if(instrumentRegExp.test(value)) { match = true; }

          });
        });

      }

      // Checks for translations
      if(!match) {

        Object.keys(languagesRegExp).forEach(language => {

          // looks for translations
          if(language !== releaseLanguage) {

            if(languagesRegExp[language].test(value)) { match = true };

          }

        });

      }

      if(match) {

        // Check for instrument / role
        occurrence.field.push(field);
        occurrence.value.push(row[field]);
        occurrence.explanation_id.push(defaultExplanationId);
        occurrence.error_type.push(defaultErrorType);

      }

    }

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0){ return occurrence; }

  return false;

};
