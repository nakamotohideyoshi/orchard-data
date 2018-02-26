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
  report.addFilter('filter6');

  it('should report - genre is folk and composer is artist', () => {

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

  it('should not report - composer is artist but genre is classical', () => {

    const { validGenre } = mocks;

    let occurrences = filter(validGenre, report);

    // method should not return occurrences
    assert.equal(_.isObject(occurrences), true);
    assert.equal(_.isEmpty(occurrences), true);

  });

  it('should not report - composer is not listed as artist', () => {

    const { valid } = mocks;

    let occurrences = filter(valid, report);

    // method should not return occurrences
    assert.equal(_.isObject(occurrences), true);
    assert.equal(_.isEmpty(occurrences), true);

  });

  it('should report - multiple track composers and single release composer', () => {

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
  it(`should report - genre is soundtrack, one composer on track level but artist
      is not composer`, () => {

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

});
