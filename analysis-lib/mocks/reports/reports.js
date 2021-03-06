module.exports = {

  'field_by_field': {
    'occurrences': [
      {
        'row_id': 1,
        'dataset_row_id': 1,
        'field': ['release_name'],
        'value': ['A value'],
        'explanation_id': [-1],
        'error_type': ['error']
      },
      {
        'row_id': 2,
        'dataset_row_id': 2,
        'field': ['track_name'],
        'value': ['Another value'],
        'explanation_id': [1],
        'error_type': ['warning']
      },
      {
        'row_id': 3,
        'dataset_row_id': 3,
        'field': ['release_name', 'track_name'],
        'value': ['A value', 'Another value'],
        'explanation_id': [1, -1],
        'error_type': ['warning', 'error']
      }
    ],

    'field_by_field_report': [
      {
        'dataset_id': 1,
        'dataset_row_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 1,
        'test_data_field_ids': JSON.stringify(['release_name']),
        'test_data_field_values': JSON.stringify(['A value']),
        'test_data_field_explanations_ids': JSON.stringify([-1]),
        'test_data_field_error_types': JSON.stringify(['error'])
      },
      {
        'dataset_id': 1,
        'dataset_row_id': 2,
        'criteria_id': 'filter1',
        'test_data_row_id': 2,
        'test_data_field_ids': JSON.stringify(['track_name']),
        'test_data_field_values': JSON.stringify(['Another value']),
        'test_data_field_explanations_ids': JSON.stringify([1]),
        'test_data_field_error_types': JSON.stringify(['warning'])
      },
      {
        'dataset_id': 1,
        'dataset_row_id': 3,
        'criteria_id': 'filter1',
        'test_data_row_id': 3,
        'test_data_field_ids': JSON.stringify(['release_name', 'track_name']),
        'test_data_field_values': JSON.stringify(['A value', 'Another value']),
        'test_data_field_explanations_ids': JSON.stringify([1, -1]),
        'test_data_field_error_types': JSON.stringify(['warning', 'error'])
      }
    ]
  },

  'error_by_error': {
    'field_by_field_report': [
      {
        'dataset_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 1,
        'test_data_field_ids': JSON.stringify(['release_name']),
        'test_data_field_values': JSON.stringify(['A value']),
        'test_data_field_explanations_ids': JSON.stringify(['default']),
        'test_data_field_error_types': JSON.stringify(['error'])
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 2,
        'test_data_field_ids': JSON.stringify(['track_name']),
        'test_data_field_values': JSON.stringify(['Another value']),
        'test_data_field_explanations_ids': JSON.stringify(['abbreviation']),
        'test_data_field_error_types': JSON.stringify(['warning'])
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 3,
        'test_data_field_ids': JSON.stringify(['release_name', 'track_name']),
        'test_data_field_values': JSON.stringify(['A value', 'Another value']),
        'test_data_field_explanations_ids': JSON.stringify(['default', 'default']),
        'test_data_field_error_types': JSON.stringify(['warning', 'error'])
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter2',
        'test_data_row_id': 1,
        'test_data_field_ids': JSON.stringify(['release_name']),
        'test_data_field_values': JSON.stringify(['A value']),
        'test_data_field_explanations_ids': JSON.stringify(['default']),
        'test_data_field_error_types': JSON.stringify(['error'])
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter2',
        'test_data_row_id': 2,
        'test_data_field_ids': JSON.stringify(['track_name']),
        'test_data_field_values': JSON.stringify(['Another value']),
        'test_data_field_explanations_ids': JSON.stringify(['default']),
        'test_data_field_error_types': JSON.stringify(['error'])
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter2',
        'test_data_row_id': 3,
        'test_data_field_ids': JSON.stringify(['release_name', 'track_name']),
        'test_data_field_values': JSON.stringify(['A value', 'Another value']),
        'test_data_field_explanations_ids': JSON.stringify(['default', 'default']),
        'test_data_field_error_types': JSON.stringify(['warning', 'error'])
      }
    ]
  },

  'row_by_row': {
    'field_by_field_report': [
      {
        'dataset_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 1,
        'test_data_field_ids': ['release_name'],
        'test_data_field_values': ['A value'],
        'test_data_field_explanations_ids': [-1],
        'test_data_field_error_types': ['error']
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 2,
        'test_data_field_ids': ['track_name'],
        'test_data_field_values': ['Another value'],
        'test_data_field_explanations_ids': [1],
        'test_data_field_error_types': ['warning']
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter1',
        'test_data_row_id': 3,
        'test_data_field_ids': ['release_name', 'track_name'],
        'test_data_field_values': ['A value', 'Another value'],
        'test_data_field_explanations_ids': [1, -1],
        'test_data_field_error_types': ['warning', 'error']
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter2',
        'test_data_row_id': 1,
        'test_data_field_ids': ['release_name'],
        'test_data_field_values': ['A value'],
        'test_data_field_explanations_ids': [-1],
        'test_data_field_error_types': ['error']
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter2',
        'test_data_row_id': 2,
        'test_data_field_ids': ['track_name'],
        'test_data_field_values': ['Another value'],
        'test_data_field_explanations_ids': [1],
        'test_data_field_error_types': ['error']
      },
      {
        'dataset_id': 1,
        'criteria_id': 'filter2',
        'test_data_row_id': 3,
        'test_data_field_ids': ['release_name', 'track_name'],
        'test_data_field_values': ['A value', 'Another value'],
        'test_data_field_explanations_ids': [1, -1],
        'test_data_field_error_types': ['warning', 'error']
      }
    ]

    // 'error_by_error_report_tsv':
  }

}
