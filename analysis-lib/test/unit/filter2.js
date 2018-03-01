const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filterId = 'filter2';

const mocks = require(`../../mocks/${filterId}`);

const filter = require(`../../src/filters/${filterId}`);
const filterMeta = require('../../src/filters/filters-meta')[filterId];

const defaultErrorType = filterMeta['type'];
const defaultExplanationId = 'default';

const reportModule = require('../../src/scripts/report-tool');

describe(`should test ${filterId}`, () => {

  const report = new reportModule();
  report.init();
  report.addFilter(filterId);

  it('validates occurrences fields', () => {

    const mock = mocks['releaseErrors'];

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

  it('should report - additional information occurs on release artist level', () => {

    const mock = mocks['releaseErrors'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['orchard_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_artists_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_artists_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['release_artists_composer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 5:
          assert.deepEqual(occurrence.field, ['release_artists_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - additional information occurs on track artist level', () => {

    const mock = mocks['trackErrors'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['track_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['track_artist_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['track_artist_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['track_artist_composer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - names are translated', () => {

    const mock = mocks['translatedName'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(idx) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_artists_featuring',            'track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani Guitarist', 'Joe Satriani โจอี้ บอย']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani 群星 ']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani فنانون متنوعون']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani Διάφοροι καλλιτέχνες']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani אמנים שונים']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 5:
          assert.deepEqual(occurrence.field, ['track_artist_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani Разные исполнители']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - multiple errors on same line', () => {

    const mock = mocks['multipleErrors'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['release_artists_featuring','release_artists_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarist)','Joe Satriani (Guitarist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId,defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType,defaultErrorType]);

          break;

      }

    });

  });

  it('should report - different roles appear on release artist level', () => {

    const mock = mocks['instruments'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['orchard_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Drums)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Pianos)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_artists_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Drummer)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_artists_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitars)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['release_artists_composer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Pianist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 5:
          assert.deepEqual(occurrence.field, ['release_artists_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Vocalist)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 6:
          assert.deepEqual(occurrence.field, ['release_artists_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Bass)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 7:
          assert.deepEqual(occurrence.field, ['release_artists_composer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Vocals)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 8:
          assert.deepEqual(occurrence.field, ['release_artists_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Keyboard)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - different roles (in portuguese )appear on release artist level', () => {

    const mock = mocks['instrumentsPortuguese'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['orchard_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarrista)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['orchard_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Cantora)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Piano)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_artists_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Baterista)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 4:
          assert.deepEqual(occurrence.field, ['release_artists_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Guitarra)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 5:
          assert.deepEqual(occurrence.field, ['release_artists_composer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Pianista)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 6:
          assert.deepEqual(occurrence.field, ['release_artists_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Vocalistas)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 7:
          assert.deepEqual(occurrence.field, ['release_artists_remixer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Baixo)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 8:
          assert.deepEqual(occurrence.field, ['release_artists_composer']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Baixista)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 9:
          assert.deepEqual(occurrence.field, ['release_artists_conductor']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (Teclado)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - years appear on release artist level', () => {

    const mock = mocks['year'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['orchard_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (1992)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (2012-2015)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_artists_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (1990)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

  it('should report - dates appear on release artist level', () => {

    const mock = mocks['date'];

    mock.forEach((row, idx) => {

      const occurrence = filter(row, idx, report);

      switch(occurrence.row_id) {

        case 0:
          assert.deepEqual(occurrence.field, ['orchard_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (27/02/2018)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (27-02-2018)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 2:
          assert.deepEqual(occurrence.field, ['release_artists_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (feb-27-2018)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

        case 3:
          assert.deepEqual(occurrence.field, ['release_artists_featuring']);
          assert.deepEqual(occurrence.value, ['Joe Satriani (02-27-2018)']);
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
          assert.deepEqual(occurrence.error_type, [defaultErrorType]);

          break;

      }

    });

  });

});
