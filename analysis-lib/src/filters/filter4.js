// Artist Name formatting (cannot be Last, First)

module.exports = function(row, idx, report) {

  const removeDiacritics = require('../scripts/remove-diacritics');

  // retrieves filter description
  const filterName = 'filter4';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const releaseLanguage = row['release_meta_language'].trim().toLowerCase();

  const fields = [
    'release_artists_primary_artist',
    'release_artists_featuring',
    'release_artists_remixer',
    'release_artists_composer',
    'release_artists_conductor',
    'track_artist',
    'track_artist_featuring',
    'track_artist_remixer',
    'track_artist_composer',
    'track_artist_conductor'
  ];

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };

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

        // No Commas
        if(value.split(",").length === 1) { return false; }

        // More than one comma
        if(value.split(",").length > 2) { return false; }

        // More than three words
        if(value.split(" ").length > 2) { return false; }

        // Test Valid words
        if(releaseLanguage === 'english') {

          if(value.match(/\&/gi)) { return; }
          if(value.match(/and/gi)) { return; }
          if(value.match(/the/gi)) { return; }
          if(value.match(/band/gi)) { return; }
          if(value.match(/quartet/gi)) { return; }
          if(value.match(/sextet/gi)) { return; }
          if(value.match(/trio/gi)) { return; }
          if(value.match(/orchestra/gi)) { return; }
          if(value.match(/choir/gi)) { return; }

        }

        // if value has made it this far, report as an occurrence
        occurrence.field.push(field);
        occurrence.value.push(row[field]);
        occurrence.explanation_id.push(defaultExplanationId);
        occurrence.error_type.push(defaultErrorType);

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
