const path = require('path')

module.exports = {
  'metadata': {
    valid: {
      'source': path.resolve(__dirname, '..', '..', 'data-tests', 'all-testcases.tsv'),
      'artist_blacklist': 'test',
      'keyword_blacklist': 'keywords',
      'duplicates_threshold': 1,
      'various_artists_threshold': 0,
      'lang': 'en-US',
      'status': 1,
      'time': Date.now()
    },
    invalid: {
      'source': path.resolve(__dirname, '..', '..', 'data-tests', 'all-testcases-NOT-A-VALID-FILE.tsv'),
      'artist_blacklist': 'test',
      'keyword_blacklist': 'keywords',
      'duplicates_threshold': 1,
      'various_artists_threshold': 0,
      'lang': 'en-US',
      'status': 1,
      'time': Date.now()
    },
    invalidDatatypes: {
      'source': null,
      'artist_blacklist': null,
      'keyword_blacklist': null,
      'duplicates_threshold': null,
      'various_artists_threshold': null,
      'lang': null,
      'status': null,
      'time': null
    },
    missingArguments: {
      'artist_blacklist': 'test',
      'keyword_blacklist': 'keywords',
      'duplicates_threshold': 1,
      'various_artists_threshold': 0,
      'lang': 'en-US',
      'status': 1,
      'time': Date.now()
    },
    nullObject: null
  },

  'saveTsv': {
    valid: path.resolve(__dirname, '..', '..', 'data-tests', 'input-files',
      'upload-errors', 'shouldpass-correct-num-fields.tsv'),

    wrongField: path.resolve(__dirname, '..', '..', 'data-tests', 'input-files',
      'upload-errors', 'wrong-field.tsv'),

    extraField: path.resolve(__dirname, '..', '..', 'data-tests', 'input-files',
      'upload-errors', 'extra-field.tsv'),

    parserError: path.resolve(__dirname, '..', '..', 'data-tests', 'input-files',
      'upload-errors', 'shouldfail-too-few-fields.tsv'),

    fileDoesNotExist: path.resolve(__dirname, '..', '..', 'data-tests', 'input-files',
      'upload-errors', 'i dont exist :(')
  },

  'logErrorIntoDB': {

    'valid': {
      'row_id': 1,
      'message': `I'm an error message`
    },

    'nullValue': {
      'row_id': null,
      'message': `I'm an error message`
    },

    'invalidObject': null

  },

  'getDatasetSize': {

    dataset: {
      'source': path.resolve(__dirname, '..', '..', 'data-tests',
        'input-files', 'filter1', 'test.tsv'),
      'dataset_id': 999,
      'size': 11
    }

  }

}
