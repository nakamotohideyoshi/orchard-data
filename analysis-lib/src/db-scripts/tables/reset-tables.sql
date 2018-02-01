DROP TABLE IF EXISTS orchard_dataset_contents;
DROP TABLE IF EXISTS dataset_meta;
DROP TABLE IF EXISTS field_by_field_reports;
DROP TABLE IF EXISTS batch_results_reports;

.read ./src/db-scripts/tables/create-orchard-dataset-contents-table.sql
.read ./src/db-scripts/tables/create-field-by-field-reports-table.sql
.read ./src/db-scripts/tables/create-dataset-meta-table.sql
.read ./src/db-scripts/tables/create-batch-results-reports-table.sql
