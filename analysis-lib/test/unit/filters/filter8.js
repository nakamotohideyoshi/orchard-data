const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter8';

const mocks = require(`../../../mocks/filters/${filterId}`);

const filter = require(`../../../src/filters/${filterId}`);
const filterMeta = require('../../../src/filters/filters-meta')[filterId];

const defaultErrorType = filterMeta['type'];
const defaultExplanationId = 'default';

const reportModule = require('../../../src/scripts/report-tool');

describe(`should test ${filterId}`, () => {

  const report = new reportModule();
  report.init();
  report.addFilter(filterId);

  it('validates occurrences fields', () => {

    const mock = mocks['invalidScore'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      assert.equal(_.isObject(occurrence), true);
      assert.equal(!_.isEmpty(occurrence.field), true);
      assert.equal(!_.isEmpty(occurrence.value), true);
      assert.equal('explanation_id' in occurrence, true);
      assert.equal('error_type' in occurrence, true);
      assert.equal(occurrence.value.length, occurrence.field.length);
      assert.equal(occurrence.value.length, occurrence.explanation_id.length);
      assert.equal(occurrence.value.length, occurrence.error_type.length);

    });

  });

  it('should not report - genre is not soundtrack or score', () => {

    const mock = mocks['valid'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.equal(occurrence, false);
        break;

      }

    });

  });

  // Invalid value inside brackets
  it('should report - value inside parentheses is invalid', () => {

    const mock = mocks['invalidValueInsideBrackets'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence.field, ['release_name']);

      switch(idx) {

      case 0:
        assert.deepEqual(occurrence.value, ['Cosmos: A SpaceTime Odyssey [I carry no information], Vol. 1']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

      }

    });

  });

    // invalidScore
    it('should report - genre is score but there are no parenthesis', () => {

      const mock = mocks['invalidScore'];

      mock.forEach((row, idx) => {

        const occurrence = filter(row, idx, report);
        assert.deepEqual(occurrence.field, ['release_name']);

        switch(idx) {

          case 0:
            assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory']);
            assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
            assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        }

    });

  });

  // squareBrackets
  it('should not report - information inside square brackets is valid', () => {

    const mock = mocks['squareBrackets'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  // squareBrackets
  it('should not report - genre is soundtrack and information is inside parentheses', () => {

    const mock = mocks['validSoundtrack'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

});
