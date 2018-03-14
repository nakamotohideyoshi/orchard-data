const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');
const reportUtils = require('../../src/scripts/utils');

const mocks = require('../../mocks/reports/reports');

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

    let occurrences = mocks['field_by_field']['occurrences'];

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
    mocks['field_by_field']['occurrences'].forEach(occurrence => report.addOccurrence(filter, occurrence));

    report.calcFieldByFieldReportAll()
      .then(FBFReport => {

        let report = mocks['field_by_field']['field_by_field_report'];
        assert.deepEqual(report, FBFReport);

      });

  });

  it('should test error by error report tsv', () => {

    const FBFReport = mocks['error_by_error']['field_by_field_report'];
    const EBEReportMock = [];

    Object.keys(filtersMeta).forEach(filterId => {

      const filter = filtersMeta[filterId];

      const obj = {
        'count': 0,
        'criteriaId': filterId,
        'description': filtersMeta[filterId]['userExplanation']
      };

      if(filterId === 'filter1' || filterId === 'filter2') { obj['count'] = 3; }

      EBEReportMock.push(obj);

    });

    EBEReportMock.sort((a,b) => b['count'] - a['count']);

    const headers = ['count', 'criteriaId', 'description'];
    let tsv = headers.join('\t');
    tsv += '\n';

    EBEReportMock.forEach(occurrence => {

      const values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    const EBEReport = reportUtils.errorByError(FBFReport);
    const EBEReportTsv = reportUtils.errorByErrorToTsv(EBEReport);

    assert.deepEqual(EBEReportTsv, tsv);

  });

  it('should test row by row report', () => {

    const FBFReport = mocks['row_by_row']['field_by_field_report'];
    let RBRReportMock = [];
    const datasetSize = 5;

    for(let i = 1; i <= datasetSize; i++) {

      const obj = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS'
      };

      switch(i) {

        case 1:
          obj['errors'] = 2;
          obj['grade'] = 'ERROR';
          break;

        case 2:
          obj['errors'] = 1;
          obj['warnings'] = 1;
          obj['grade'] = 'ERROR';
          break;

        case 3:
          obj['errors'] = 2;
          obj['warnings'] = 2;
          obj['grade'] = 'ERROR';
          break;

      }

      RBRReportMock.push(obj);

    }

    RBRReportMock = RBRReportMock.sort((a, b) => {

      let a_Problems = a['errors'] + a['warnings'];
      let b_Problems = b['errors'] + b['warnings'];

      return b_Problems - a_Problems || b['errors'] - a['errors'];

    });

    const RBRReport = reportUtils.rowByRow(FBFReport, datasetSize);
    assert.deepEqual(RBRReport, RBRReportMock);

  });

  it('should test row by row report tsv', () => {

    const FBFReport = mocks['row_by_row']['field_by_field_report'];
    let RBRReportMock = [];
    const datasetSize = 5;

    for(let i = 1; i <= datasetSize; i++) {

      const obj = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS'
      };

      switch(i) {

        case 1:
          obj['errors'] = 2;
          obj['grade'] = 'ERROR';
          break;

        case 2:
          obj['errors'] = 1;
          obj['warnings'] = 1;
          obj['grade'] = 'ERROR';
          break;

        case 3:
          obj['errors'] = 2;
          obj['warnings'] = 2;
          obj['grade'] = 'ERROR';
          break;

      }

      RBRReportMock.push(obj);

    }

    RBRReportMock = RBRReportMock.sort((a, b) => {

      let a_Problems = a['errors'] + a['warnings'];
      let b_Problems = b['errors'] + b['warnings'];

      return b_Problems - a_Problems || b['errors'] - a['errors'];

    });

    const headers = ['rowId', 'errors', 'warnings', 'grade'];
    let tsv = headers.join('\t');
    tsv += '\n';

    RBRReportMock.forEach(occurrence => {

      const values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    const RBRReport = reportUtils.rowByRow(FBFReport, datasetSize);
    const RBRReportTsv = reportUtils.rowByRowToTsv(RBRReport);
    assert.deepEqual(RBRReportTsv, tsv);

  });

});
