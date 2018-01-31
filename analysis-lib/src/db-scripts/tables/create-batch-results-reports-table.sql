CREATE TABLE IF NOT EXISTS batch_results_reports (
  dataset_id                FOREIGN_KEY NOT NULL,
  no_of_rows                NUMBER      NOT NULL,
  no_of_errors              NUMBER      NOT NULL,
  error_percent             NUMBER      NOT NULL,
  error_score               NUMBER      NOT NULL
);
