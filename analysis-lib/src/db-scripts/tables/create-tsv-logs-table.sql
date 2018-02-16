CREATE TABLE IF NOT EXISTS tsv_logs_table (
  dataset_id                FOREIGN_KEY NOT NULL,
  row_id                    NUMBER      NOT NULL,
  message                   TEXT        NOT NULL
);
