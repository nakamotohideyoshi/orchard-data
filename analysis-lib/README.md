Issue #14 in project electron-the-orchard is about processing the TSV file within the Electron app. We want to be able to work on the data processing logic from the command line, because Electron is too cumbersome. Please create a CLI tool for that.

The ticket to create that CLI tool is #15:
https://gitlab.com/vivadata/electron-the-orchard/issues/15

The tool will support a Node.js module that can be used later on, in the hook created for #14.

We will use a completely separate repo for this purpose.

In this CLI, do not spend time making it pretty. It is only for our debugging convenience.


### Analysis Lib Module

Analysis Lib Module new exposes a REST api.

To start the server:

`
npm run dev
`

## Methods

# Fetch a dataset in TSV format

URL: '/dataset/:datasetId.tsv'<br />
Method: 'GET'<br />
<br />
@return: Array => An array containing a TSV dataset

# Create new dataset and run filters

URL: '/dataset' <br />
Method: 'POST' <br />
Content-Type: 'application/json' <br />
<br />
@args JSON => the data to be saved into the dataset\_meta table <br />
@return: JSON => an object containing a key 'dataset-id', which
represents the ID of the recently saved dataset-meta.

# Fetch Field by Field Report in TSV format

URL:  '/field-by-field-report/:datasetId.tsv'<br />
URL2: '/field-by-field-report/:category/:datasetId.tsv'<br />
Method: 'GET'<br />

<br />
@return: TSV => A TSV string of the FBF Report of the specified dataset.

# Fetch Single Field by Field Report

URL: '/field-by-field-report/:datasetId'<br />
URL: '/field-by-field-report/:category/:datasetId'<br />
Method: 'GET'<br />

<br />
@return: Array => An array containing records from field\_by\_field\_reports table
with dataset\_id = :datasetId.

# Fetch All Field by Field Reports

URL: '/field-by-field-reports' <br />
Method: 'GET' <br />

<br />
@return: Array => An array containing all records (if any) in the
field\_by\_field\_reports table.

# Fetch Row by Row Aggregate

URL: '/row-by-row/:datasetId'<br />
URL: '/row-by-row/:category/:datasetId'<br />
Method: 'GET'<br />

<br />
@return: JSON => A JSON containing row-by-row reports of specified dataset

# Fetch Row by Row Aggregate in TSV format

URL: '/row-by-row/:datasetId.tsv'<br />
URL: '/row-by-row/:category/:datasetId.tsv'<br />
Method: 'GET'<br />

<br />
@return: TSV => A TSV string containing row-by-row reports of specified dataset

# Fetch Report Summaries

URL: '/report-summaries'<br />
Method: 'GET'<br />

<br />
@return: Array => An array containing all the records (if any) in the
batch\_results\_reports table.

# Fetch Single Report Summary

URL: '/report-summary/:datasetId'<br />
Method: 'GET'<br />

<br />
@return: Array => An array containing records (if any) from batch\_results\_reports table with dataset\_id = :datasetId.

# Fetch Dataset Meta

URL: '/dataset-meta/:rowId'<br />
Method: 'GET'<br />
<br />
@return: Array => An array containing records from dataset\_meta table with rowId = 'rowId'

# Fetch Dataset Meta Table

URL: '/dataset-meta-all'<br />
Method: 'GET'<br />
<br />
@return: Array => An array with all records from dataset\_meta

### CLI

## Row by Row aggregate

From input file: `npm run gen-row-report -- --input=<input\_file>`
From STDIN: `STDIN | xargs -0 npm run gen-row-report`

Examples:

`curl http://localhost:3000/field-by-field-report/1.tsv | xargs -0 npm run gen-row-report`
`cat ./reports1.tsv | xargs -0 npm run gen-row-report`

## Error by Error aggregate

From input file: `npm run gen-error-report -- --input=<input\_file>`
From STDIN: `STDIN | xargs -0 npm run gen-error-report`

Examples:

`curl http://localhost:3000/field-by-field-report/1.tsv | xargs -0 npm run gen-error-report`
`cat ./reports1.tsv | xargs -0 npm run gen-error-report`

## Unit Testing

We have two ways to run unit testing in the API project and while in a local environment, examples:

`npm run test:unit`

This one will create a new database (see `analysis-lib/test/unit/global.js`), perform test found in `analysis-lib/unit`, report back and then wipe the test database.

Sometimes we may want to inspect the database created after all test run, to achieve that you can easily run the following command:

`npm run test:unit:keep_db`

Unlike `test:unit` command the `keep_db` version will not remove the *.db* file created at unit test warmup, however this database will be wiped the next time the test suite is executed.

*More details to come*
