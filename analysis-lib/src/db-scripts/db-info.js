/* This module serves as a global variable for database information.
 * In order to avoid propagation on the code in case a database name changes,
 * they are all referenced in this file. Further information (e.g., columns
 * names) can be added here if needed. */
module.exports = {

  'analysis-lib-dev': {
    'path': ['.', 'db'], // path is relative to the root of the project
    'name': 'analysis-lib.db',

    'tables': {

      'field_by_field_reports': {
        'name': 'field_by_field_reports'
      },

      'orchard_dataset_contents': {
        'name': 'orchard_dataset_contents'
      },

      'dataset_meta': {
        'name': 'dataset_meta'
      }

    }
  },

  'analysis-lib': {
    'path': ['..', 'analysis-lib', 'db'], // path is relative to the root of the project
    'name': 'analysis-lib.db',

    'tables': {

      'field_by_field_reports': {
        'name': 'field_by_field_reports'
      },

      'orchard_dataset_contents': {
        'name': 'orchard_dataset_contents'
      },

      'dataset_meta': {
        'name': 'dataset_meta'
      }

    }
  }

};
