const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter15';

const mocks = require(`../../../mocks/filters/${filterId}`);

const filter = require(`../../../src/filters/${filterId}`);
const filterMeta = require('../../../src/filters/filters-meta')[filterId];

const defaultErrorType = filterMeta['type'];
const defaultExplanationId = 'default';

const reportModule = require('../../../src/scripts/report-tool');

describe(`should test ${filterId}`, () => {

  let report = new reportModule();
  report.init();
  report.addFilter(filterId);

  it('should pass: Track Name - Track [not an integer]', () => {

    const mock = mocks['trackNNotIntegerTrackName'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);
    });

  });

  it('should pass: Track name - Instrumental [any string]', () => {

    const mock = mocks['instrumentalAnyStringTrackName'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);
    });

  });

  it('should fail: Track Name - Instrumental', () => {

    const mock = mocks['instrumentalTrackName'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      switch(idx) {
      case 0:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['Instrumental']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      case 1:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['Instrumental']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      case 2:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['Instrumental']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      }
    });

  });

  it('should fail: Track Name - Track [N]', () => {

    const mock = mocks['trackNTrackName'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      switch(idx) {
      case 0:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['Track 25']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      case 1:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['Pista 25']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      case 2:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['Faixa 25']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      }
    });

  });

  it('should fail: Track Name - Track [N] (case-insensitive match)', () => {

    const mock = mocks['caseInsensitiveMatchTrackName'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      switch(idx) {
      case 0:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['track 31']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      case 1:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['pista 31']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      case 2:
        assert.deepEqual(occurrence.field, ['track_name']);
        assert.deepEqual(occurrence.value, ['faixa 31']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      }
    });

  }); 
  
});
