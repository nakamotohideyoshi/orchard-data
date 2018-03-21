CREATE TABLE IF NOT EXISTS batch_results_reports (
  dataset_id                FOREIGN_KEY NOT NULL,
  no_of_rows                NUMBER      NOT NULL,
  no_of_risk_errors         NUMBER      NOT NULL,  
  error_risk_percent        NUMBER      NOT NULL,
  error_risk_score          NUMBER      NOT NULL,
  no_of_itunes_errors       NUMBER      NOT NULL,  
  error_itunes_percent      NUMBER      NOT NULL,
  error_itunes_score        NUMBER      NOT NULL,
  vacount_percent           NUMBER      NOT NULL
);
