const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter7';

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

    const mock = mocks['invalidRelease'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      assert.deepEqual(_.isObject(occurrence), true);
      assert.deepEqual(!_.isEmpty(occurrence.field), true);
      assert.deepEqual(!_.isEmpty(occurrence.value), true);
      assert.deepEqual('explanation_id' in occurrence, true);
      assert.deepEqual('error_type' in occurrence, true);
      assert.deepEqual(occurrence.value.length, occurrence.field.length);
      assert.deepEqual(occurrence.value.length, occurrence.explanation_id.length);
      assert.deepEqual(occurrence.value.length, occurrence.error_type.length);

    });

  });

  // name after parentheses
  it('should not report - value after parenthesis', () => {

    const mock = mocks['nameAfterParenthesis'];
    const occurrence = filter(mock[0], 0, report);

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence, false);

    });

  });

  // invalid releases
  it('should report - invalid strings occur on release names', () => {

    const mock = mocks['invalidRelease'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Album Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Original Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Previously Unreleased)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Reissue)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 4:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Original Mix)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 5:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (iTunes LP Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 6:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Clean Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 7:
          assert.deepEqual(occurrence.field, ['release_name', 'track_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Explicit Version)', 'This Should Fail (Album Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
        break;

        case 8:
          assert.deepEqual(occurrence.field, ['release_name', 'track_name']);
          assert.deepEqual(occurrence.value, ['This Should Fail (Mastered for iTunes)', 'This Should Fail (Original Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
        break;

      }

    });

  });

  // invalid tracks
  it('should report - invalid strings occur on track names', () => {

    const mock = mocks['invalidTracks'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence.field, ['track_name']);

      switch(occurrence.rowId) {

        case 0:
          assert.deepEqual(occurrence.value, ['This Should Fail (Album Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 1:
          assert.deepEqual(occurrence.value, ['This Should Fail (Original Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 2:
          assert.deepEqual(occurrence.value, ['This Should Fail (Previously Unreleased)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 3:
          assert.deepEqual(occurrence.value, ['This Should Fail (Reissue)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 4:
          assert.deepEqual(occurrence.value, ['This Should Fail (Original Mix)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 5:
          assert.deepEqual(occurrence.value, ['This Should Fail (iTunes LP Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 6:
          assert.deepEqual(occurrence.value, ['This Should Fail (Clean Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 7:
          assert.deepEqual(occurrence.value, ['This Should Fail (Explicit Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 8:
          assert.deepEqual(occurrence.value, ['This Should Fail (Mastered for iTunes)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

      }

    });

  });

  // multiple errors on row
  it('should report - invalid strings occur on release and track names', () => {

    const mock = mocks['multipleErrors'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence.field, ['release_name','track_name']);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.value,
            ["This Should Fail (Album Version)","This Should Fail (Previously Unreleased)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
          break;

        case 1:
          assert.deepEqual(occurrence.value,
            ["This Should Fail (Explicit Version)","This Should Fail (Album Version)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
          break;

        case 2:
          assert.deepEqual(occurrence.value,
            ["This Should Fail (Mastered for iTunes)","This Should Fail (Original Version)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
          break;

      }

    });

  });

  // multiple parenthesis
  it(`should report - multiple parentheses occur on a field with invalid values`, () => {

    const mock = mocks['multipleParentheses'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence.field, ['release_name']);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.value, ['This Should Fail (Album Version) [Original Version]']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

        case 1:
          assert.deepEqual(occurrence.value, ['This Should Fail [Original Version] (Album Version)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

      }

    });

  });

  // multiple parentheses with invalid values
  it('should not report - multiple parentheses occur on a field with valid values', () => {

    const mock = mocks['multipleParentheses2'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence, false);

    });

  });

  // multiple parentheses with invalid values
  it('should not report - unmatched parentheses', () => {

    const mock = mocks['unmatchedValidSingle'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });
  // multiple parentheses with invalid values
  it('should not report - multiple unmatched parentheses', () => {

    const mock = mocks['unmatchedValid'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  // multiple parentheses with invalid values
  it('should report - multiple unmatched parentheses with invalid value', () => {

    const mock = mocks['unmatchedInvalid'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);
      assert.deepEqual(occurrence.field, ['release_name']);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.value, ['this should fail (Album version) no information]']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;

      }

    });

  });

});
