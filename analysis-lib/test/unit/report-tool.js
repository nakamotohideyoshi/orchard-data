const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');

const mocks = require('../../mocks/field-by-field-report');

describe('should test report tool', () => {

  let report;
  let filter;

  beforeEach(() => {

    report = new reportModule();
    report.init(1);

    filter = 'filter1';
    report.addFilter(filter);

  });

  it('should test add filter', () => {

    let filterDesc = filtersMeta[filter];

    let obj = {};
    obj[filter] = { 'occurs_on': {} };

    Object.keys(filterDesc).forEach(key => obj[filter][key] = filterDesc[key]);
    assert.deepEqual(report.filters[filter], obj[filter]);

  });

  it('should test add occurrence', () => {

    let occurrences = mocks['occurrences'];

    let occurrence_report = {};

    occurrence_report['1'] = {
      'row_id': 1,
      'fields': ['release_name'],
      'values': ['A value'],
      'explanations_ids': [-1],
      'error_types': ['error'],
    };

    report.addOccurrence(filter, occurrences[0]);
    assert.deepEqual(report.filters[filter]['occurs_on'], occurrence_report);

    occurrence_report['2'] = {
      'row_id': 2,
      'fields': ['track_name'],
      'values': ['Another value'],
      'explanations_ids': [1],
      'error_types': ['warning'],
    };

    report.addOccurrence(filter, occurrences[1]);
    assert.deepEqual(report.filters[filter]['occurs_on'], occurrence_report);

    let occurrence3_mock = {
      'row_id': 3,
      'field': ['release_name', 'track_name'],
      'value': ['A value', 'Another value'],
      'explanation_id': [1, -1],
      'error_type': ['warning', 'error'],
    };

    occurrence_report['3'] = {
      'row_id': 3,
      'fields': ['release_name', 'track_name'],
      'values': ['A value', 'Another value'],
      'explanations_ids': [1, -1],
      'error_types': ['warning', 'error'],
    };

    report.addOccurrence(filter, occurrences[2]);
    assert.deepEqual(report.filters[filter]['occurs_on'], occurrence_report);

  });

  it('should test field by field report', () => {

    // Adds occurrences
    mocks['occurrences'].forEach(occurrence => report.addOccurrence(filter, occurrence));

    report.calcFieldByFieldReportAll()
      .then(FBFReport => {

        let report = mocks['field_by_field_report'];

        assert.deepEqual(report, FBFReport);

      });

  });

});
