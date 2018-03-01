const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter3';

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

    const mock = mocks['invalid'];

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

  it('should report - invalid release names', () => {

    const mock = mocks['invalid'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Greatest Hits']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Summer 00s']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Best Party Hits']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Christmas 1992']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Halloween']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 5:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Pink Floyd Volume II']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }
    });

  });

  it('should report - invalid release names in portuguese', () => {

    const mock = mocks['invalidPortuguese'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Melhores Hits']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Verão 2010']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Festa']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Melhores canções de natal']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Halloween']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 5:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['Para malhar']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

});
