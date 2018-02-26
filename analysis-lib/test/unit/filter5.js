const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const mocks = require('../../mocks/filter5');
const filter = require('../../src/filters/filter5');
const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');

describe('should test filter 5', () => {

  let report = new reportModule();
  report.init();
  report.addFilter('filter5');

  it('should report - invalid keywords occur on artists fields', () => {

    const { invalid } = mocks;

    invalid.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      assert.equal(_.isObject(occurrence), true);
      assert.equal(!_.isEmpty(occurrence.field), true);
      assert.equal(!_.isEmpty(occurrence.value), true);

      switch(occurrence.rowId) {

        case 0:
          assert.include(occurrence.field, 'release_artists_primary_artist');
          assert.include(occurrence.value, 'Yoga');

          break;

        case 1:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.field, 'release_artists_primary_artist');
          assert.include(occurrence.value, 'Yoga');
          assert.include(occurrence.value, 'Christmas');

          break;

        case 2:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Top Hits');

          break;

        case 3:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Chorus');

          break;

        case 4:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Orchestra');

          break;

        case 5:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Singer');

          break;

        case 6:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Meditation');

          break;

        case 7:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Baby');

          break;

        case 8:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Workout');

          break;

      }

    });

  });

  // Valid test should return false
  it('should not report - invalid keywords do not occur ', () => {

    const { valid } = mocks;

    valid.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  it('should report - invalid portuguese keywords occur on artists fields', () => {

    const { invalidPortuguese } = mocks;

    invalidPortuguese.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      assert.equal(_.isObject(occurrence), true);
      assert.equal(!_.isEmpty(occurrence.field), true);
      assert.equal(!_.isEmpty(occurrence.value), true);

      switch(occurrence.rowId) {

        case 0:
          assert.include(occurrence.field, 'release_artists_primary_artist');
          assert.include(occurrence.value, 'Yoga');

          break;

        case 1:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.field, 'release_artists_primary_artist');
          assert.include(occurrence.value, 'Yoga');
          assert.include(occurrence.value, 'Natal');

          break;

        case 2:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Melhores Hits');

          break;

        case 3:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Coral');

          break;

        case 4:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Orquestra');

          break;

        case 5:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Cantor');

          break;

        case 6:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Meditação');

          break;

        case 7:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Cantora');

          break;

        case 8:
          assert.include(occurrence.field, 'orchard_artist');
          assert.include(occurrence.value, 'Malhação');

          break;

      }

    });

  });

  // Valid test should return false
  it('should not report - invalid portuguese keywords do not occur', () => {

    const { validPortuguese } = mocks;

    validPortuguese.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

  // Valid test should return false
  it('should not report - language not supported', () => {

    const { invalidLanguage } = mocks;

    invalidLanguage.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);

    });

  });

});
