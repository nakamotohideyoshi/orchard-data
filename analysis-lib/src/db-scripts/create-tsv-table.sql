CREATE TABLE IF NOT EXISTS tsv_files (
  filename                  text        NOT NULL,
  table_name                text        NOT NULL,
  unique(table_name)
);
