# Files in this directory

* Complete Upload Test for Musical Turk [COLOR CODED].xlsx - Sheet1.tsv
  * 14889 rows of real data in the wild, guaranteed to turn your hair gray and your eyes red

* bug-236-language-detection.tsv
  * Throws a false-positive language-detection error "The value of the meta should match the language of the metadata, not the audio."

* column-headers.tsv
  * Dataless file with only the header row. This is a null case which should be processable with no errors.

* metalanguage-japanese.tsv
  * In this data file Release Metadata Language is "japanese." In error 237 (https://gitlab.com/vivadata/orchard-data-tests/issues/217) (now fixed) that would crash the app. This file was designed to test what happens with a completely unsupported language.
  * This file should always throw an error for "The value of the meta should match the language of the metadata, not the audio."
