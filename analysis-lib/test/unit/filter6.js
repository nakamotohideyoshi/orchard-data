const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const mocks = require('../../mocks/filter6');
const filter = require('../../src/filters/filter6');

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');

describe('should test filter 6', () => {

  let report = new reportModule();
  report.init();
  report.addFilter('filter5');

  it('should fail genre is folk', () => {

    const { invalidGenre } = mocks;

    let occurrences = filter(invalidGenre, report);
    let occurrence = occurrences[0];

    assert.equal(_.isObject(occurrences), true);

    // same number of fields and values
    assert.equal(!_.isEmpty(occurrence.field), true);
    assert.equal(!_.isEmpty(occurrence.value), true);
    assert.equal(occurrence.field.length, occurrence.value.length);

    // Fields with the same composer
    assert.equal(occurrence.field[0], '["orchard_artist","release_artists_composer"]');
    assert.equal(occurrence.field[1], '["orchard_artist","track_artist_composer"]');
    assert.equal(occurrence.field[2], '["release_artists_primary_artist","release_artists_composer"]');
    assert.equal(occurrence.field[3], '["release_artists_primary_artist","track_artist_composer"]');

    // Fields values
    assert.equal(occurrence.value[0], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrence.value[1], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrence.value[2], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrence.value[3], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');

  });

  it('should pass genre is classical', () => {

    const { validGenre } = mocks;

    let occurrences = filter(validGenre, report);

    // method should not return occurrences
    assert.equal(_.isObject(occurrences), true);
    assert.equal(_.isEmpty(occurrences), true);

  });

  it('should pass', () => {

    const { valid } = mocks;

    let occurrences = filter(valid, report);

    // method should not return occurrences
    assert.equal(_.isObject(occurrences), true);
    assert.equal(_.isEmpty(occurrences), true);

  });

  it('should fail multiple track composers and single release composer', () => {

    const { multipleTrackComposers } = mocks;

    let occurrences = filter(multipleTrackComposers, report);

    assert.equal(_.isObject(occurrences), true);

    occurrences.forEach(occurrence => {

      // same number of fields and values
      assert.equal(!_.isEmpty(occurrence.field), true);
      assert.equal(!_.isEmpty(occurrence.value), true);
      assert.equal(occurrence.field.length, occurrence.value.length);

    })

    // Fields with the same composer
    assert.equal(occurrences[0].field[0], '["orchard_artist","release_artists_composer"]');
    assert.equal(occurrences[0].field[1], '["orchard_artist","track_artist_composer"]');
    assert.equal(occurrences[0].field[2], '["release_artists_primary_artist","release_artists_composer"]');
    assert.equal(occurrences[0].field[3], '["release_artists_primary_artist","track_artist_composer"]');

    // Fields values
    assert.equal(occurrences[0].value[0], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[0].value[1], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[0].value[2], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[0].value[3], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');

    // Second row
    assert.equal(occurrences[1].field[0], '["orchard_artist","release_artists_composer"]');
    assert.equal(occurrences[1].field[1], '["release_artists_primary_artist","release_artists_composer"]');

    assert.equal(occurrences[1].value[0], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[1].value[1], '["Pyotr Ilyich Tchaikovsky","Pyotr Ilyich Tchaikovsky"]');

  });

  // Valid test should return occurrence with empty fields
  it('should fail wrong name', () => {

    const { wrongName } = mocks;

    let occurrences = filter(wrongName, report);

    assert.equal(_.isObject(occurrences), true);

    occurrences.forEach(occurrence => {

      // same number of fields and values
      assert.equal(!_.isEmpty(occurrence.field), true);
      assert.equal(!_.isEmpty(occurrence.value), true);
      assert.equal(occurrence.field.length, occurrence.value.length);

    })

    // Fields with the same composer
    assert.equal(occurrences[0].field[0], '["orchard_artist","release_artists_composer"]');
    assert.equal(occurrences[0].field[1], '["orchard_artist","track_artist_composer"]');
    assert.equal(occurrences[0].field[2], '["release_artists_primary_artist","release_artists_composer"]');
    assert.equal(occurrences[0].field[3], '["release_artists_primary_artist","track_artist_composer"]');

    // Fields values
    assert.equal(occurrences[0].value[0], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[0].value[1], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[0].value[2], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[0].value[3], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');

    // Second row
    assert.equal(occurrences[1].field[0], '["orchard_artist","release_artists_composer"]');
    assert.equal(occurrences[1].field[1], '["orchard_artist","track_artist_composer"]');
    assert.equal(occurrences[1].field[2], '["release_artists_primary_artist","release_artists_composer"]');
    assert.equal(occurrences[1].field[3], '["release_artists_primary_artist","track_artist_composer"]');

    assert.equal(occurrences[1].value[0], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[1].value[1], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[1].value[2], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');
    assert.equal(occurrences[1].value[3], '["Wrong Name","Pyotr Ilyich Tchaikovsky"]');

  });

  /*
  it('should acuse occurrences portuguese', () => {

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

  // Valid test should return occurrence with empty fields
  it('should pass portuguese', () => {

    const { validPortuguese } = mocks;

    validPortuguese.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      assert.equal(_.isObject(occurrence), true);
      assert.equal(occurrence.rowId, 0);
      assert.equal(_.isEmpty(occurrence.field), true);
      assert.equal(_.isEmpty(occurrence.value), true);

    });

  });

  // Valid test should return occurrence with empty fields
  it('should return empty occurrence - invalid language', () => {

    const { invalidLanguage } = mocks;

    invalidLanguage.forEach((row, idx) => {

      let occurrence = filter(row, idx, report);

      assert.equal(_.isObject(occurrence), true);
      assert.equal(occurrence.rowId, 0);
      assert.equal(_.isEmpty(occurrence.field), true);
      assert.equal(_.isEmpty(occurrence.value), true);

    });

  });

  */

});
