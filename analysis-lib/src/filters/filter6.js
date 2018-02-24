// Composer as artist

module.exports = function(dataset, report) {

  let removeDiacritics = require('../scripts/remove-diacritics');
  let filterName = 'filter6';

  let hasMultipleComposers = false;
  let lastTrackComposer;

  let occurrences = [];

  let artistFields = ['orchard_artist', 'release_artists_primary_artist'];
  let composerFields = ['release_artists_composer', 'track_artist_composer'];

  // Checks for multiple composers on track level
  dataset.forEach(row => {

    let trackComposer = removeDiacritics(row['track_artist_composer']).trim().toLowerCase();

    if(lastTrackComposer && (lastTrackComposer !== trackComposer)) { hasMultipleComposers = true; }
    lastTrackComposer = trackComposer;

  });

  // Runs filters
  dataset.forEach((row, idx) => {

    let genre = row['genre'] || row['sub_genre'];
    genre = removeDiacritics(genre).trim().toLowerCase();

    let occurrence = {
      'rowId': idx,
      'field': [],
      'value': []
    };

    // console.log(row);

    artistFields.forEach(aField => {
      composerFields.forEach(cField => {

        let artist = removeDiacritics(row[aField]).trim().toLowerCase();
        let composer = removeDiacritics(row[cField]).trim().toLowerCase();

        // checks if genre is not classical
        if(artist === composer && genre !== 'classical') {
          occurrence.field.push(JSON.stringify([aField, cField]));
          occurrence.value.push(JSON.stringify([row[aField], row[cField]]));
          // occurrence.field.push(cField);
          // occurrence.value.push(row[cField]);
        }

        else if(artist === composer && hasMultipleComposers && genre === 'classical') {
          occurrence.field.push(JSON.stringify([aField, cField]));
          occurrence.value.push(JSON.stringify([row[aField], row[cField]]));
          // occurrence.field.push(cField);
          // occurrence.value.push(row[cField]);
        }

        // checks if artist is different of composer if genre is soundtrack
        else if(artist !== composer && !hasMultipleComposers && genre === 'soundtrack') {
          occurrence.field.push(JSON.stringify([aField, cField]));
          occurrence.value.push(JSON.stringify([row[aField], row[cField]]));
          // occurrence.field.push(cField);
          // occurrence.value.push(row[cField]);
        }

      });
    });

    // If there was any occurrences
    if(occurrence.field.length > 0) { occurrences.push(occurrence); }

  });

  // If anything error occurred, creates report
  occurrences.forEach(occurrence => report.addOccurrence(filterName, occurrence));

  return occurrences;

};
