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

});
