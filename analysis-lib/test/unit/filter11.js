const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter11';

const mocks = require(`../../mocks/${filterId}`);

const filter = require(`../../src/filters/${filterId}`);
const filterMeta = require('../../src/filters/filters-meta')[filterId];

const defaultErrorType = filterMeta['type'];
const defaultExplanationId = 'default';

const reportModule = require('../../src/scripts/report-tool');

describe(`should test ${filterId}`, () => {

  let report = new reportModule();
  report.init();
  report.addFilter(filterId);

  it('validates occurrences fields', () => {

    let mock = mocks['invalid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

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

  // Valid
  it('should not report - only valid strings occur', () => {

    const mock = mocks['valid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.equal(occurrence, false);
        break;

      }

    });

  });

  // Valid
  it('should not report - value after parens', () => {

    const mock = mocks['textAfterParens'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.equal(occurrence, false);
        break;

      }

    });

  });

  // Valid
  it('should not report - only valid strings occur in spanish', () => {

    const mock = mocks['validSpanish'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.equal(occurrence, false);
        break;

      }

    });

  });

  // Valid
  it('should not report - emptyFields', () => {

    const mock = mocks['emptyFields'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.equal(occurrence, false);
        break;

      }

    });

  });

  // Valid
  it('should not report - only valid strings occur in portuguese', () => {

    const mock = mocks['validPortuguese'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.equal(occurrence, false);
        break;

      }

    });

  });

  it('should report - invalid formatting of with/feat', () => {

    const mock = mocks['invalid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (w/ Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 1:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (With Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 2:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (WITH Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 3:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (Feat Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 4:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (FEAT Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 5:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (feat Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 6:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (Featuring Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 7:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (FEATURING Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 8:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (Feat Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 9:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Calling (FEAT Akon, P-Money & Raquel)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - with/feat appears in spanish', () => {

    const mock = mocks['invalidSpanish'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Pongo (presentando Dummy)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Pongo (con Dummy)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

      }

    });

  });

  it('should report - with/feat appears in portuguese', () => {

    const mock = mocks['invalidPortuguese'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Pongo (apresentando Dummy)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Pongo (com Dummy)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

      }

    });

  });

});
