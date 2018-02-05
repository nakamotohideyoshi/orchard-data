// Check Various Artists on Track Levels

module.exports = function(row, idx, report) {

  // retrieves filter description
  let filterName = 'filter1';
  let removeDiacritics = require('../scripts/remove-diacritics');

  // Captures all fields related to 'Track Artists'
  let fields = ['track_artist', 'track_artist_featuring'];

  // Captures invalid field values
  let invalidStrings = {
    'abbreviations':          /^v\/?\.?a\.?$/i,
    'arabic':                 /^فنانون متنوعون$/i,
    'english':                /^(vario)u?(s)(\,?\.? ?(artist)s?)?$/i,
    'chinese-simplified':     /^群星$/i,
    'chinese-traditional':    /^群星$/i,
    'dutch':                  /^(verschillende)(\,?\.? ?(artiest)(en)?)?$/i,
    'french':                 /^(multi)(\-?\,?\.? ?)((interprete)(s)?)?((artiste)(s)?)?$/i,
    'german':                 /^(verschiedene)(\-?\,?\.? ?(Interprete)(n)?)?$/i,
    'greek':                  /^(Διάφοροι καλλιτέχνες)$/i,
    'hebrew':                 /^אמנים שונים$/,
    'italian':                /^(artisti)(\-?\,?\.? ?(vari)?)?$/i,
    'korean':                 /^여러 아티스트$/i,
    'portuguese':             /^(varios)(\-?\,?\.? ?(interpretes)?)?$/i,
    'russian':                /^(Разные исполнители)$/i,
    'spanish':                /^(varios)(\-?\,?\.? ?(artista)(s)?)?$/i,
    'swedish':                /^(blandade)(\-?\,?\.? ?(artist)(er)?)?$/i,
    'thai':                   /^รวมศิลปิน$/i,
    'turkish':                /^(cesitli)(\-?\,?\.? ?(sanatcilar)?)?$/i
  };

  var languages = Object.keys(invalidStrings);
  console.log(row);

  // Iterates over each TSV field
  Object.keys(row).forEach(field => {

    // If field is related to 'track artists'
    if(fields.indexOf(field) !== -1) {

      let value = row[field];

      // Only tests if value is non-null
      if(value) {

        // forEach does not allow continue/break
        for(i = 0; i < languages.length; i++) {

          let regex = invalidStrings[languages[i]];

          // Removes diacritics and removes trimming whitespaces
          value = value.trim();
          value = removeDiacritics(value);

          console.log("\n");
          console.log(field);
          console.log(row[field]);
          console.log(regex);
          console.log(value);
          console.log(regex.test(value));
          console.log("\n");

          // error condition is met
          if(regex.test(value)) {

            var occurrence = {
              'rowId': idx,
              'field': field,
              'value': row[field]
            };

            // stores error occurrence in filter report
            report.addOccurrence(filterName, occurrence);

            // Doesn't need to test other languages
            break;

          }

        }

      }

    }

  });

  return true;

};
