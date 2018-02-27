// Generic Artist Names

module.exports = function(row, idx, report) {

  const removeDiacritics = require('../scripts/remove-diacritics');

  // retrieves filter description
  const filterName = 'filter5';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const fields = ['orchard_artist', 'release_artists_primary_artist'];
  const releaseLanguage = row['release_meta_language'].toLowerCase();

  const occurrence = {
    'rowId': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

  const invalidKeywords = {
    'english': [
      /Vol(\.? ?[0-9]*)?/gi,
      /Volume(\.? ?[0-9]*)?/gi,
      /Hit(s)?/gi,
      /Best/gi,
      /Greatest/gi,
      /Essential(s)?/gi,
      /Spring/gi,
      /Summer/gi,
      /Fall/gi,
      /Winter/gi,
      /50s/gi,
      /60s/gi,
      /70s/gi,
      /80s/gi,
      /90s/gi,
      /00s/gi,
      /Party/gi,
      /Dinner/gi,
      /Celebration/gi,
      /Yoga/gi,
      /Meditation/gi,
      /Sleep/gi,
      /Chill(ing)?/gi,
      /Workout/gi,
      /Halloween/gi,
      /Spooky/gi,
      /Christmas/gi,
      /Valentines/gi,
      /St(\.)? ?Patrick('s)?/gi,
      /Baby/gi,
      /Singer(s)?/gi,
      /Chorus/gi,
      /Orchestra/gi,
      /Cast/gi,
    ],
    'portuguese': [
      /Vol(\.? ?[0-9]*)?/gi,
      /Volume(\.? ?[0-9]*)?/gi,
      /Hit(s)?/gi,
      /Melhor(es)?/gi,
      /Essencia(l|is)/gi,
      /Primavera/gi,
      /Verao/gi,
      /Outono/gi,
      /Inverno/gi,
      /50s/gi,
      /60s/gi,
      /70s/gi,
      /80s/gi,
      /90s/gi,
      /00s/gi,
      /Festa/gi,
      /Jantar/gi,
      /Comemoracao/gi,
      /Yoga/gi,
      /Meditacao/gi,
      /Dormir/gi,
      /Sono/gi,
      /Relaxar/gi,
      /Academia/gi,
      /Musculacao/gi,
      /Malhacao/gi,
      /Halloween/gi,
      /Natal/gi,
      /Namorados/gi,
      /St(\.)? ?Patrick/gi,
      /Cantor(a)?(s|es)?/gi,
      /Orquestra/gi,
      /Grupo/gi,
      /Coral/gi,
      /Coro/gi,
    ],
  };

  // Language not supported
  if(!(releaseLanguage in invalidKeywords)) { return false; }

  // If field is related to 'track artists'
  Object.keys(row).forEach(field => {

    // Field should be tested
    if(fields.indexOf(field) !== -1) {

      let value = row[field];

      // Only tests if value is non-null
      if(value) {

        // Removes trailling whitespaces and diacritics
        value = value.trim();
        value = removeDiacritics(value);

        const regExps = invalidKeywords[releaseLanguage];

        for(let i = 0; i < regExps.length; i++) {

          const regExp = regExps[i];

          // Invalid Value
          if(regExp.test(value)) {

            occurrence.field.push(field);
            occurrence.value.push(row[field]);
            occurrence.explanation_id.push(defaultExplanationId);
            occurrence.error_type.push(defaultErrorType);

            // Doesn't need to test other regex
            break;

          }

        }

      }

    }

  });

  // If anything error occurred, creates report
  if(occurrence.field.length > 0){

    report.addOccurrence(filterName, occurrence);
    return occurrence;

  }

  else { return false; }

};
