CREATE TABLE IF NOT EXISTS field_by_field_reports (
  dataset_id                        FOREIGN_KEY NOT NULL,
  criteria_id                       ANY         NOT NULL,
  test_data_row_id                  ANY         NOT NULL,
  test_data_field_ids               ANY         NOT NULL,
  test_data_field_values            ANY         NOT NULL,
  test_data_field_explanations_ids  ANY,
  test_data_field_error_types       ANY         NOT NULL
);
