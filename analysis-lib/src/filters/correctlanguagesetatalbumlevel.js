// Filter: correct language set at album level

module.exports = async function (row, idx) {
  'use strict';
  const removeDiacritics = require('../scripts/remove-diacritics');

  var languageDetector = new (require('languagedetect'));

  const filterName = 'correctlanguagesetatalbumlevel';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  const releaseLanguage = row['release_meta_language'] ? row['release_meta_language'].trim().toLowerCase() : 'english';
  const fields = ['release_name', 'track_name'];

  const occurrence = {
    'row_id': idx,
    'field': [],
    'value': [],
    'explanation_id': [],
    'error_type': [],
  };
  

  const result = await new Promise(async (resolve, reject) => {

    // If field is related to 'release_meta_language'
    for (let field of fields) {

      // temp to store best match language
      let bestMatch = [releaseLanguage, 0];

      const value = row[field]? row[field].trim() : '';

      // language detect using 'languagedetect' libarary
      const detectResults = languageDetector.detect(value);
      let count = 0;

      for (let result of detectResults) {

        // find the score of 'English', 'Portuguese', and 'Spanish'
        if (result[0]==='english' || result[0]==='portuguese' || result[0]==='spanish') {

          count++;
          if (result[1]>bestMatch[1]){
            bestMatch[0] = result[0];
            bestMatch[1] = result[1];
          }

          if (count === 3) {
            break;
          }

        }
      }

      // doesn't match with 'release_meta_language'
      if (bestMatch[0]!==releaseLanguage){

        occurrence.field.push(field);
        occurrence.value.push(row[field]);
        occurrence.explanation_id.push(defaultExplanationId);
        occurrence.error_type.push(defaultErrorType);
        break;

      }
    }
    
    if(occurrence.field.length > 0){

      resolve(occurrence);

    } else {

      resolve(false);

    }
  });

  return result;
  
};
