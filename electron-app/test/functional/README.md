
Sample files for QAing the app.

Generated from https://docs.google.com/spreadsheets/d/1rg8psnC6ziaWXFYPspm1Hqdu45F2z94H2vQmYP8RNpk/edit#gid=1092817590

See https://gitlab.com/vivadata/orchard-data-tests/issues/152 for requireents

# Expect

TSVs for QA - Sheet2.tsv
* 100% success. No errors. All reports empty.

TSVs for QA - Sheet3.tsv
* 100% failure in iTunes filters, 0 failures in Risk. All rows have an iTunes error and no Risk errors.

TSVs for QA - Sheet4.tsv
* 25% failure in iTunes filters. 1/4 rows have an iTunes error and no Risk errors. Check: report summary stats are accurate.

TSVs for QA - Sheet5.tsv
* 33% failure in risk assessment filter. 1/3 rows have a risk assessment error; there are no iTunes errors. Check: report summary stats are accurate.

TSVs for QA - Sheet6.tsv
* One filter has 2 iTunes errors, another has 1 iTunes error, there are no other errors. Check: error-by-error report gets these numbers right.

TSVs for QA - Sheet7.tsv
* One row has 2 iTunes errors, another has 1 iTunes error, no other rows have errors. Check: row-by-row report, field-by-field-report, error-by-error report
