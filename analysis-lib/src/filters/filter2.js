// Additional information

module.exports = function(row, idx, report) {

  // retrieves filter description
  let filterName = 'filter2';
  let removeDiacritics = require('../scripts/remove-diacritics');

  let releaseLanguage = row['release_meta_language'].trim().toLowerCase();

  let fieldsRegExp = [
    /^orchard_artist$/i,
    /^(release_artist(s)?)(\_[A-Z]*)*$/i,
    /^(track_artist(s)?)(\_[A-Z]*)*$/i,
  ];

  // Common instruments RegExp
  let instrumentsRegExp = {

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
  let languagesRegExp = {

    'japanese': /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/,
    'chinese':  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/,
    'hebrew':   /[\u0590-\u05FF]/,
    'arabic':   /[\u0600-\u06FF\u0750-\u077F]/,
    'greek':    /[\u0370-\u03FF]/,
    'russian':  /[\u0400-\u04FF]/,
    'thai':     /[\u0E00-\u0E7F]/

  };

  // Years only
  let yearsRegExp = /^([12][0-9]{3})?\-?\/?([12][0-9]{3})?$/;

  // Does not check valid dates, just the digits
  let dateRegExp = [
    // dd/mm/YY
    /^[0-3]?[0-9].(([0-3]?[0-9])|(Jan|Mar|May|Jul|Aug|Oct|Dec)).(?:[0-9]{2})?[0-9]{2}$/i,
    // mm/dd/YY
    /^(([0-3]?[0-9])|(Jan|Mar|May|Jul|Aug|Oct|Dec)).[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/,
    // YY/mm/dd
    /^(?:[0-9]{2})?[0-9]{2}.(([0-3]?[0-9])|(Jan|Mar|May|Jul|Aug|Oct|Dec)).[0-3]?[0-9]$/
  ];

  let parenthesisRegExp = /(\(.*\))|\(|\)/g;

  let occurrence = {
    'rowId': idx,
    'field': [],
    'value': []
  };

  // If field is related to 'track artists'
  Object.keys(row).forEach(field => {

    // forEach does not allow the use of break/continue
    fieldsRegExp.forEach(fieldRegExp => {

      // Field should be tested
      if(fieldRegExp.test(field)) {

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

              let instrument = instrumentsRegExp[instrumentId];

              Object.keys(instrument).forEach(language => {

                let instrumentRegExp = instrument[language];
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

          }

        }

      }

    });

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0){ report.addOccurrence(filterName, occurrence); }

  return true;

};
