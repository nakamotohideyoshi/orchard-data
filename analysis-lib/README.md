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

# Save Datasets Meta and Run Filters

URL: '/api/save-and-run-filters' <br />
Method: 'POST' <br />
Content-Type: 'application/json' <br />
<br />
@args JSON => the data to be saved into the dataset\_meta table <br />
@return: JSON => an object containing a key 'dataset-id', which
represents the ID of the recently saved dataset-meta.

# Fetch All Field by Field Reports

URL: '/api/fetch-all-field-by-field-reports' <br />
Method: 'GET' <br />
Content-Type: 'application/json' <br />
<br />
@return: Array => An array containing all records (if any) in the
field\_by\_field\_reports table.

# Fetch Single Field by Field Reports

URL: '/api/fetch-field-by-field-report/:datasetId'<br />
Method: 'GET'<br />
Content-Type: 'application/json'<br />
<br />
@return: Array => An array containing records from field\_by\_field\_reports table
with dataset\_id = :datasetId.

# Fetch All Batch Results Reports

URL: '/api/fetch-all-batch-results-report'<br />
Method: 'GET'<br />
Content-Type: 'application/json'<br />
<br />
@return: Array => An array containing all the records (if any) in the
batch\_results\_reports table.

# Fetch Single Batch Results Report

URL: '/api/fetch-batch-results-report/:datasetId'<br />
Method: 'GET'<br />
Content-Type: 'application/json'<br />
<br />
@return: Array => An array containing records (if any) from batch\_results\_reports table with dataset\_id = :datasetId.

# Fetch Dataset Meta

URL: '/api/fetch-batch-results-report'<br />
Method: 'POST'<br />
Content-Type: 'application/json'<br />
<br />
@args JSON(optional) => must have key 'rowId'<br />
@return: Promise => if 'rowId' was specified, fetch records from dataset\_meta table with rowId = 'rowId'.  Otherwise, returns all records.
