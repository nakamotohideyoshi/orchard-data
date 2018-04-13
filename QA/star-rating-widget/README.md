# Sample data files for star rating widget

To properly test the star rating widget we need a set of sets of standardized test files.
To use these the tester should delete all other datasets before a test run.

Set 1: One dataset with any random error rate The star rating should be two

Set 2: Dataset 1: 100% errors (should be 0 stars) Dataset 2: 75% errors (should be 1 star) Dataset 3: 25% errors (should be 2 stars) Dataset 4: 0% errors (should be 4 stars)

Set 3: Dataset 1: 100% errors (should be 2 or 3 stars) Dataset 2: 100% errors (should be 2 or 3 stars) Dataset 3: 100% errors (should be 2 or 3 stars)
Once we have these ready, do a test pass and verify the results.

## Star rating algorithm

Let error_ratio = (errors + warnings * .5) / number of rows

Then to calculate the number of stars to show:

If this is the first dataset in the database's history, return no value, let star count = 2

Otherwise,

Get average and standard deviation of error_ratio across all recorded datasets.

Then, for any given dataset,

If error_ratio < average - .5 * stddev let star count = 1

Else If error_ratio < average let star count = 2

Else If error_ratio < average + .5 * stddev let star count = 3

Else let star count = 4

## Admin
See #189 for the definition of the star rating widget.

These are for issue #214
https://gitlab.com/vivadata/orchard-data-tests/issues/214

The sources for this text file and these data files are at
https://drive.google.com/drive/folders/1fHX9MfFMX9_jFBmCOXqZo1qGCz6QzwGx?usp=sharing
