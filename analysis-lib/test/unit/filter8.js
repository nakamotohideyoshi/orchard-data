const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const mocks = require('../../mocks/filter8');
const filter = require('../../src/filters/filter8');

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');

describe('should test filter 8', () => {

  let report = new reportModule();
  report.init();
  report.addFilter('filter8');

  // Valid
  it('should not report - genre is not soundtrack or score', () => {

    try {

      const mock = mocks['valid'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        switch(idx) {

          case 0:
            assert.equal(occurrence, false);
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  // Invalid value inside brackets
  it('should report - value inside parentheses is invalid', () => {

    try {

      const mock = mocks['invalidValueInsideBrackets'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        // same number of fields and values
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        // Only field being tested
        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value, 'Cosmos: A SpaceTime Odyssey [I carry no information], Vol. 1');
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  // invalidScore
  it('should report - genre is score but there are no parenthesis', () => {

    try {

      const mock = mocks['invalidScore'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        // same number of fields and values
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        // Only field being tested
        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value, 'Telephone Free Landslide Victory');
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  // squareBrackets
  it('should not report - information inside square brackets ', () => {

    try {

      const mock = mocks['squareBrackets'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);
        assert.equal(occurrence, false);

      });

    }

    catch(err) { throw err; }

  });

  // squareBrackets
  it('should not report - genre is soundtrack and information is inside parentheses', () => {

    try {

      const mock = mocks['validSoundtrack'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);
        assert.equal(occurrence, false);

      });

    }

    catch(err) { throw err; }

  });

  /*
  // Valid test should return occurrence with empty fields
  it('report should not be empty - invalid release names', () => {

    try {

      const mock = mocks['invalidRelease'];
      let occurrences = [];

      mock.forEach((row, idx) => occurrences.push(filter(mock[0], 0, report)));

      assert.equal(_.isObject(occurrences), true);

      occurrences.forEach(occurrence => {

        // same number of fields and values
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(occurrence.rowId) {

          case 0:
            assert.equal(occurrence.value[0], 'This Should Fail (Album Version)');
            break;

          case 1:
            assert.equal(occurrence.value[0], 'This Should Fail (Original Version)');
            break;

          case 2:
            assert.equal(occurrence.value[0], 'This Should Fail (Previously Unreleased)');
            break;

          case 3:
            assert.equal(occurrence.value[0], 'This Should Fail (Reissue)');
            break;

          case 4:
            assert.equal(occurrence.value[0], 'This Should Fail (Original Mix)');
            break;

          case 5:
            assert.equal(occurrence.value[0], 'This Should Fail (iTunes LP Version)');
            break;

          case 6:
            assert.equal(occurrence.value[0], 'This Should Fail (Clean Version)');
            break;

          case 7:
            assert.equal(occurrence.value[0], 'This Should Fail (Explicit Version)');
            break;

          case 8:
            assert.equal(occurrence.value[0], 'This Should Fail (Mastered for iTunes)');
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  // Valid test should return occurrence with empty fields
  it('report should not be empty - invalid track names', () => {

    try {

      const mock = mocks['invalidTracks'];
      let occurrences = [];

      mock.forEach((row, idx) => occurrences.push(filter(mock[0], 0, report)));

      assert.equal(_.isObject(occurrences), true);

      occurrences.forEach(occurrence => {

        // same number of fields and values
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'track_name');

        switch(occurrence.rowId) {

          case 0:
            assert.equal(occurrence.value[0], 'This Should Fail (Album Version)');
            break;

          case 1:
            assert.equal(occurrence.value[0], 'This Should Fail (Original Version)');
            break;

          case 2:
            assert.equal(occurrence.value[0], 'This Should Fail (Previously Unreleased)');
            break;

          case 3:
            assert.equal(occurrence.value[0], 'This Should Fail (Reissue)');
            break;

          case 4:
            assert.equal(occurrence.value[0], 'This Should Fail (Original Mix)');
            break;

          case 5:
            assert.equal(occurrence.value[0], 'This Should Fail (iTunes LP Version)');
            break;

          case 6:
            assert.equal(occurrence.value[0], 'This Should Fail (Clean Version)');
            break;

          case 7:
            assert.equal(occurrence.value[0], 'This Should Fail (Explicit Version)');
            break;

          case 8:
            assert.equal(occurrence.value[0], 'This Should Fail (Mastered for iTunes)');
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  // Valid test should return occurrence with empty fields
  it('report should not be empty - multiple errors on same row', () => {

    try {

      const mock = mocks['multipleErrors'];

      mock.forEach((row, idx) => {

        occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);

        // same number of fields and values
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.deepEqual(occurrence.field, ['release_name','track_name']);

        switch(idx) {

          case 0:
            assert.deepEqual(occurrence.value,
              ["This Should Fail (Album Version)","This Should Fail (Previously Unreleased)"]);
            break;

          case 1:
            assert.deepEqual(occurrence.value,
              ["This Should Fail (Explicit Version)","This Should Fail (Album Version)"]);
            break;

          case 2:
            assert.deepEqual(occurrence.value,
              ["This Should Fail (Mastered for iTunes)","This Should Fail (Original Version)"]);

        }

      });

    }
    catch(err) { throw err; }

  });

  // Valid test should return occurrence with empty fields
  it('report be empty - multiple parentheses', () => {

    try {

      const mock = mocks['multipleParentheses'];

      mock.forEach((row, idx) => {

        occurrence = filter(row, idx, report);

        assert.equal(occurrence.field, 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value, 'This Should Fail (Album Version) [Original Version]');
            break;

          case 1:
            assert.equal(occurrence.value, 'This Should Fail [Original Version] (Album Version)');
            break;

        }

      });


    }

    catch(err) { throw err; }

  });
  */

});
