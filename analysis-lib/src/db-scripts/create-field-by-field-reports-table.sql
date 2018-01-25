CREATE TABLE IF NOT EXISTS field_by_field_reports (
  filter_id                 text        NOT NULL,
  filename                  text        NOT NULL,
  criteria_id               any         NOT NULL,
  test_data_row_id          any         NOT NULL,
  test_data_field_id        any         NOT NULL,
  test_data_field_value     any         NOT NULL,
  unique(filter_id, filename, criteria_id, test_data_row_id, test_data_field_id,
        test_data_field_value)
);
