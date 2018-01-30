CREATE TABLE IF NOT EXISTS batch_results_reports (
  filter_id                 TEXT        NOT NULL,
  dataset_id                FOREIGN_KEY NOT NULL,
  criteria_id               ANY         NOT NULL,
  error_percent             NUMBER      NOT NULL,
  error_score               NUMBER      NOT NULL,
  unique(filter_id, dataset_id)
);
