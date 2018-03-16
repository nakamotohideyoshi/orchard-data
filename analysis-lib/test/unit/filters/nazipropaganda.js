const assert = require('chai').assert;
const describe = require('mocha').describe;
const it = require('mocha').it;

const ReportModule = require('../../../src/scripts/report-tool');

const filterId = 'nazipropaganda';
const mocks = require(`../../../mocks/filters/${filterId}`);
const filter = require(`../../../src/filters/${filterId}`);
const filterMeta = require('../../../src/filters/filters-meta')[filterId];

const defaultErrorType = filterMeta.type;
const defaultExplanationId = 'default';

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule();
  report.init();
  report.addFilter(filterId);

  it('should fail: keyword in field Release Name', () => {
    mocks.failForHavingKeywordInFieldReleaseName.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['release_name']);
      assert.deepEqual(occurrence.value, ['Tender Hooks Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Orchard Artist', () => {
    mocks.failForHavingKeywordInFieldOrchardArtist.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['orchard_artist']);
      assert.deepEqual(occurrence.value, ['Gay and Terry Woods Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Artist URL', () => {
    mocks.failForHavingKeywordInFieldArtistUrl.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['artist_url']);
      assert.deepEqual(occurrence.value, ['http://Hakenkreuz.com']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Release Artist(s)-Primary Artist(s)', () => {
    mocks.failForHavingKeywordInFieldReleaseArtistPrimaryArtist.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist']);
      assert.deepEqual(occurrence.value, ['Gay and Terry "Hakenkreuz" Woods']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Release Artist(s)-Featuring(s)', () => {
    mocks.failForHavingKeywordInFieldReleaseArtistFeaturing.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['release_artists_featuring']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Release Artist(s)-Remixer(s)', () => {
    mocks.failForHavingKeywordInFieldReleaseArtistRemixer.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['release_artists_remixer']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Imprint', () => {
    mocks.failForHavingKeywordInFieldImprint.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['imprint']);
      assert.deepEqual(occurrence.value, ['Cooking Hakenkreuz Vinyl']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Genre', () => {
    mocks.failForHavingKeywordInFieldGenre.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['genre']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Sub-genre', () => {
    mocks.failForHavingKeywordInFieldSubGenre.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['sub_genre']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Track Name', () => {
    mocks.failForHavingKeywordInFieldTrackName.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['track_name']);
      assert.deepEqual(occurrence.value, ['Heart of Hakenkreuz Stone']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Track Artist', () => {
    mocks.failForHavingKeywordInFieldTrackArtist.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['track_artist']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz Van Beethoven']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Track Artist(s) - Featuring(s)', () => {
    mocks.failForHavingKeywordInFieldTrackArtistFeaturing.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['track_artist_featuring']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should fail: keyword in field Track Artist(s) - Remixer(s)', () => {
    mocks.failForHavingKeywordInFieldTrackArtistRemixer.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.deepEqual(occurrence.field, ['track_artist_remixer']);
      assert.deepEqual(occurrence.value, ['Hakenkreuz']);
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
      assert.deepEqual(occurrence.error_type, [defaultErrorType]);
    });
  });

  it('should pass: no keywords', () => {
    mocks.passForHavingNoKeywords.forEach((item, index) => {
      let occurrence = filter(item, index);
      assert.equal(occurrence, false);
    });
  });
});
