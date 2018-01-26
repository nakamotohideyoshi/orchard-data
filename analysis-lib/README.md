Issue #14 in project electron-the-orchard is about processing the TSV file within the Electron app. We want to be able to work on the data processing logic from the command line, because Electron is too cumbersome. Please create a CLI tool for that.

The ticket to create that CLI tool is #15:
https://gitlab.com/vivadata/electron-the-orchard/issues/15

The tool will support a Node.js module that can be used later on, in the hook created for #14.

We will use a completely separate repo for this purpose.

In this CLI, do not spend time making it pretty. It is only for our debugging convenience.


### Analysis Lib Module

This module exports the following objects:

## dbInfo (JSON)

This module serves as a global variable for database information.
In order to avoid propagation on the code in case a database name changes,
they are all referenced in this file. Further information (e.g., columns
names) can be added here if needed.

## dbInterface (MODULE)

This module exports functions to write/read from the database. All database
interaction is [Promise](https://bluebirdjs.com/docs/api-reference.html) based.

The main interaction functions are:

* dbInterface.loadTsv(inputPath) => Loads TSV file from \<input\_path\> and
  stores it on orchard\_dataset\_contents table.

* dbInterface.fetchTsvDataset(datasetId) => Returns a promise with the rows (if
  resolved) with dataset\_id = \<datasetId\> from the orchard\_dataset\_contents
  table, which corresponds to a TSV file.

* dbInterface.fetchFieldByFieldReport() => Returns a promise with all the rows (if
  resolved) of the field\_by\_field\_reports table.

## filtersDesc (JSON)

A JSON file with informations for each filter. Since each filter is referenced
through the application as 'filter\_\<filter\_id\>', this module holds all
information regarding the filters, such as Orchard descriptions and user
explanations.

## filtersModule (JSON)

A module that contains the functions for all filters.

## main (FUNCTION)

main(filterId, datasetId) is the core of the application, which will run the
filter corresponding to \<filterId\> on the rows retrieved by the
dbInterface.fetchTsvDataset(datasetId) function.


### Filters API for dev testing

## To add a TSV file to the orchard\_dataset\_contents table:

* inputDir = './data-tests/input-files'
* inputFile = '11-rows.tsv'

```
npm run add-tsv-to-db -- --input=<inputFilename>
```

## To run a single filter

Defaults:

* filter = 'filter1'
* datasetId = '11-rows.tsv'

```
npm run filters -- --datasetId=<dataset_id> --filter=<filter_id>
```
