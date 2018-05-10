const path = require('path')

module.exports = {

  'getDataset': {
    'tsvFile': path.resolve(__dirname, '..', '..', 'data-tests', 'input-files', 'filter1', 'test.tsv'),

    'dataset': path.resolve(__dirname, '..', '..', 'data-tests', 'input-files', 'filter1', 'api-test.tsv')
  },

  'saveAndRun': {
    'metadata': {
      'source': path.resolve(__dirname, '..', '..', 'data-tests', 'input-files', 'categories', 'test.tsv'),
      'artist_blacklist': 'test',
      'keyword_blacklist': 'keywords',
      'duplicates_threshold': 1,
      'various_artists_threshold': 0,
      'track_count_threshold': 1,
      'lang': 'en-US',
      'status': 1,
      'time': Date.now()
    },

    'tsvError': {
      'source': path.resolve(__dirname, '..', '..', 'data-tests', 'input-files', 'upload-errors', 'shouldfail-too-few-fields.tsv'),
      'artist_blacklist': 'test',
      'keyword_blacklist': 'keywords',
      'duplicates_threshold': 1,
      'various_artists_threshold': 0,
      'track_count_threshold': 1,
      'lang': 'en-US',
      'status': 1,
      'time': Date.now()
    },

    'success': { 'status': 'OK' }
  }

}
