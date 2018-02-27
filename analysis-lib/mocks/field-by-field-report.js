module.exports = {

  'occurrences': [
    {
      'row_id': 1,
      'field': ['release_name'],
      'value': ['A value'],
      'explanation_id': [-1],
      'error_type': ['error'],
    },
    {
      'row_id': 2,
      'field': ['track_name'],
      'value': ['Another value'],
      'explanation_id': [1],
      'error_type': ['warning'],
    },
    {
      'row_id': 3,
      'field': ['release_name', 'track_name'],
      'value': ['A value', 'Another value'],
      'explanation_id': [1, -1],
      'error_type': ['warning', 'error'],
    }
  ],

  'field_by_field_report': [
    {
      'dataset_id': 1,
      'criteria_id': 'filter1',
      'test_data_row_id': 1,
      'test_data_field_ids': JSON.stringify(['release_name']),
      'test_data_field_values': JSON.stringify(['A value']),
      'test_data_field_explanations_ids': JSON.stringify([-1]),
      'test_data_field_error_types': JSON.stringify(['error'])
    },
    {
      'dataset_id': 1,
      'criteria_id': 'filter1',
      'test_data_row_id': 2,
      'test_data_field_ids': JSON.stringify(['track_name']),
      'test_data_field_values': JSON.stringify(['Another value']),
      'test_data_field_explanations_ids': JSON.stringify([1]),
      'test_data_field_error_types': JSON.stringify(['warning'])
    },
    {
      'dataset_id': 1,
      'criteria_id': 'filter1',
      'test_data_row_id': 3,
      'test_data_field_ids': JSON.stringify(['release_name', 'track_name']),
      'test_data_field_values': JSON.stringify(['A value', 'Another value']),
      'test_data_field_explanations_ids': JSON.stringify([1, -1]),
      'test_data_field_error_types': JSON.stringify(['warning', 'error'])
    }
  ],

}
