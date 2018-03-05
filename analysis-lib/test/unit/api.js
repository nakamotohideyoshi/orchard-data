'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const chai = require('chai').use(chaiHttp);
const request = chai.request;

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');
const reportUtils = require('../../src/scripts/utils');

const mocks = require('../../mocks/api/api');

const dbInterface = require('../../src/db-scripts/db-interface');
const dbInfo = require('../../src/db-scripts/db-info');
const { DATABASE } = require('../../src/scripts/constants');

describe('should test API', function() {

  this.timeout(10000);

  let _interface;
  let _datasetId;
  const server = 'http://localhost:3000';

  before((done) => {

    _interface = new dbInterface();
    _interface.init();

    _interface.saveTsvIntoDB(mocks['getDataset']['tsvFile'])
      .then(() => done());

  });

  it('should test dataset/:datasetId - returns a dataset', (done) => {

    request(server)
      .get('/dataset/1')
      .end((err, res) => {

        const dataset = mocks['getDataset']['dataset'].sort((a,b) => a['track_no'] - b['track_no']);
        const response = JSON.parse(res.text).sort((a,b) => a['track_no'] - b['track_no']);

        expect(res).to.have.status(200);

        response.forEach((row, idx) => expect(row).to.be.an('object').that.include(dataset[idx]));
        done();

      });

  });

  it('should test dataset/:datasetId - returns an empty array', (done) => {

    request(server)
      .get('/dataset/-1')
      .end((err, res) => {

        const response = JSON.parse(res.text);
        expect(response).to.an('array').that.is.empty;

        expect(res).to.have.status(200);

        done();

      });

  });

  it('should test get /dataset - saves a tsv and run filters', (done) => {

    const metadata = mocks['saveAndRun']['metadata'];
    const success = mocks['saveAndRun']['success'];

    request(server)
      .post('/dataset')
      .send(metadata)
      .end((err, res) => {

        const response = JSON.parse(res.text);
        _datasetId = response.datasetId;

        expect(res).to.have.status(201);
        expect(response.status).to.be.equal(success.status);
        expect(response.datasetId).to.be.a('number');

        done();

      });

  });

  it('should test get /dataset - invalid tsv file: internal server error', (done) => {

    const metadata = mocks['saveAndRun']['tsvError'];

    request(server)
      .post('/dataset')
      .send(metadata)
      .end((err, res) => {

        const response = JSON.parse(res.text);

        expect(response).to.be.an('object');
        expect(response.title).to.be.not.empty;
        expect(response.detail).to.be.not.empty;
        expect(res).to.have.status(500);

        done();

      });

  });

  it('should test generated field by field report', (done) => {

    const FBFReport = mocks['fieldByField']['fieldByField'];

    request(server)
      .get(`/field-by-field/${_datasetId}`)
      .end((err, res) => {

        const response = JSON.parse(res.text).sort(function(a, b) {
          return b.criteria - a.criteria || b.fields[0]['name'] - a.fields[0]['name'] || b.fields[0]['value'] - a.fields[0]['value']
        });

        console.log(response);
        expect(res).to.have.status(200);

        response.forEach((occurrence, idx) => {

          expect(occurrence.criteria).to.be.equal(FBFReport[idx].criteria);
          expect(occurrence.fields).to.be.deep.equal(FBFReport[idx].fields);
          expect(occurrence.values).to.be.deep.equal(FBFReport[idx].values);

        });

        done();

      });

  });

  it('should return empty field by field report', (done) => {

    request(server)
      .get(`/field-by-field/-1`)
      .end((err, res) => {

        const response = JSON.parse(res.text);
        expect(res).to.have.status(200);

        expect(response).to.be.empty;
        done();

      });

  });
        // expect(response).to.be.an('object');
        // expect(response.title).to.be.not.empty;
        // expect(response.detail).to.be.not.empty;

  /*
  it('should test generated field by field report tsv', (done) => {

    const FBFReport = mocks['fieldByField']['fieldByFieldTsv'];

    request(server)
      .get(`/field-by-field/${_datasetId}.tsv`)
      .end((err, res) => {

        const response = res.text;
        expect(res.headers['content-type']).to.be.equal('text/tab-separated-values; charset=utf-8');
        expect(response).to.be.equal(FBFReport);
        expect().to.have.status(200);
        done();

      });

  });
  */

  /*
  it('should test get /dataset - saves a tsv and run filters', (done) => {

    const metadata = mocks['saveAndRun']['metadata'];
    const success = mocks['saveAndRun']['success'];

    request(server)
      .post('/dataset')
      .send(metadata)
      .end((err, res) => {

        const response = JSON.parse(res.text);
        _datasetId = response.datasetId;

        expect(res).to.have.status(200);
        expect(response.status).to.be.equal(success.status);
        expect(response.datasetId).to.be.a('number');

        done();

      });

  });
  */


  /*
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
  */

});
