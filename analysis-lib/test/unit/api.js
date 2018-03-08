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

});
