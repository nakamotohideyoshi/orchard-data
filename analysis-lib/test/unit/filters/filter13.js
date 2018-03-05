const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter13';

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

  it('should not report - valid target strings', () => {

    const mock = mocks['valid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  it('should not report - target string does not appear', () => {

    const mock = mocks['validNoTargetString'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  it('should report - invalid spelling of Vol. and/or Pt.', () => {

    const mock = mocks['invalid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ["Fixin' the Charts, Volume 1"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 1:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ['Family, Part 1: My Momma']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ["Fixin' the Charts, Vol 1"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_name']);
          assert.deepEqual(occurrence.value, ["Close Up, VOL. 1 - Love Songs"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 4:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Drivin' Wheel Blues, PT. 1"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

        case 5:
          assert.deepEqual(occurrence.field, ['track_name']);
          assert.deepEqual(occurrence.value, ["Dragging Hooks (River Song Trilogy, Part III)"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);
          break;

      }

    });

  });

  it('should report - invalid strings appear on multiple fields', () => {

    const mock = mocks['invalidMultiple'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_name', 'track_name']);
          assert.deepEqual(occurrence.value, ["Fixin' the Charts, Volume 1", "Fixin' the Charts, Volume 1"]);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_name', 'track_name']);
          assert.deepEqual(occurrence.value, ["Fixin' the Charts, Volume 1", 'Family, Part 1: My Momma']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);
          break;

      }

    });

  });

});
