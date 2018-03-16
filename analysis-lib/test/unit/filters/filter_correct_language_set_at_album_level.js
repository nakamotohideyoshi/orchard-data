const assert = require('chai').assert;
const describe = require('mocha').describe;
const it = require('mocha').it;

const filterId = 'correctlanguagesetatalbumlevel';

const mocks = require(`../../../mocks/filters/${filterId}`);

const filter = require(`../../../src/filters/${filterId}`);
const filterMeta = require('../../../src/filters/filters-meta')[filterId];

const defaultErrorType = filterMeta['type'];
const defaultExplanationId = 'default';

const reportModule = require('../../../src/scripts/report-tool');

describe(`should test ${filterId}`, function() {

  let report = new reportModule();
  report.init();
  report.addFilter(filterId);

  it('should pass: Match The Language - English', () => {

    const mock = mocks['validEnglish'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);
    });

  });

  it('should pass: Match The Language - Portuguese', () => {

    const mock = mocks['validPortuguese'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);
    });

  });

  it('should pass: Match The Language - Spanish', () => {

    const mock = mocks['validSpanish'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      assert.equal(occurrence, false);
    });

  });

  it('should fail: No Match The Language - English', () => {

    const mock = mocks['invalidEnglish'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      switch(idx) {
      case 0:
        assert.deepEqual(occurrence.field, ['release_name']);
        assert.deepEqual(occurrence.value, ['Te quiero mucho']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      }
    });

  });

  it('should fail: No Match The Language - Portuguese', () => {

    const mock = mocks['invalidPortuguese'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      switch(idx) {
      case 0:
        assert.deepEqual(occurrence.field, ['release_name']);
        assert.deepEqual(occurrence.value, ['I Love You So Much']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      }
    });

  });

  it('should fail: No Match The Language - Spanish', () => {

    const mock = mocks['invalidSpanish'];

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report);
      switch(idx) {
      case 0:
        assert.deepEqual(occurrence.field, ['release_name']);
        assert.deepEqual(occurrence.value, ['Eu te amo muito']);
        assert.deepEqual(occurrence.explanation_id, [defaultExplanationId]);
        assert.deepEqual(occurrence.error_type, [defaultErrorType]);
        break;
      }
    });

  }); 
  
});
