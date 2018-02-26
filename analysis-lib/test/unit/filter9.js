const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const mocks = require('../../mocks/filter9');
const filter = require('../../src/filters/filter9');

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');

describe('should test filter 9', () => {

  let report = new reportModule();
  report.init();
  report.addFilter('filter9');

  // Valid
  it('should not report - flagged type does not occur', () => {

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

  // Valid
  it('should not report - flagged type occurs but genre is valid', () => {

    try {

      const mock = mocks['validGenre'];

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
  it('should report - flagged type occurs separated by periods', () => {

    try {

      const mock = mocks['invalidPeriod'];

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
            assert.equal(occurrence.value, 'Space Jam (O.S.T.)');
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  // invalidScore
  it('should report - flagged type occurs on flagged genres', () => {

    try {

      const mock = mocks['invalid'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        // same number of fields and values
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        // Only field being tested
        assert.equal(occurrence.field[0], 'release_name');

        switch(occurrence.rowId) {

          case 0:
            assert.equal(occurrence.value[0], 'Space Jam (OST)');
            break;

          case 1:
            assert.equal(occurrence.value[0], 'Space Jam (OST)');
            break;

          case 2:
            assert.equal(occurrence.value[0], 'Space Jam (OST)');
            break;

          case 3:
            assert.equal(occurrence.value[0], 'Space Jam (OST)');
            break;

          case 4:
            assert.equal(occurrence.value[0], 'Space Jam (OST)');
            break;

          case 5:
            assert.equal(occurrence.value[0], 'Space Jam (OST)');
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

});
