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

  it('should not report - valid names', () => {

    const mock = mocks['valid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  it('should report - compound artists name', () => {

    const mock = mocks['invalid'];

    mock.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      switch(idx) {

        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist', 'track_artist'])
          assert.deepEqual(occurrence.value, ['Beyoncé & Shakira', 'Beyoncé & Shakira'])
          break;

        case 2:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Beyoncé & Shakira'])
          break;

        case 3:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Beyoncé & Shakira'])
          break;

      }
      assert.equal(occurrence, false);

    });

  });

});
