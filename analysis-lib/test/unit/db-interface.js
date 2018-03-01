const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const Promise = require('bluebird');
const testDB = require('./global');

const dbInterface = require('../../src/db-scripts/db-interface');
const dbInfo = require('../../src/db-scripts/db-info');
const { DATABASE } = require('../../src/scripts/constants');

const mocks = require('../../mocks/db-interface/db-interface');

describe('should test database interface utilities', function() {

  let interface;
  let filePath;
  let id;
  let request;

  //this.timeout(100000);

  beforeEach(() => {

    interface = new dbInterface();
    interface.init();

  });

  it('should test the initialized interface', () => {
    assert.typeOf(interface.dbStatus, 'object');
    assert.equal(interface.dbStatus.OK, 1);
    assert.equal(interface.dbStatus.FAIL, 2);
    assert.equal(interface.dbStatus.INPROGRESS, 3);
  });

  it('should create metadata', (done) => {
    const mock = mocks['metadata']['valid'];

    request = interface.saveDatasetMeta(mock);

    request.then((r) => {
      assert.equal(_.isObject(r), true);
      assert.equal(_.isObject(r.stmt), true);
      assert.equal(!_.isEmpty(r.stmt), true);
      assert.equal(r.stmt.changes, 1);
      assert.equal(r.stmt.lastID, 1);
      done();
    });
  });

  it('should fail to create metadata', (done) => {

    const mock = mocks['metadata']['invalid'];

    request = interface.saveDatasetMeta(mock);

    request.then((r) => {
      assert.equal(r.stmt.changes, -1);
      done();
    })
    .catch((e) => {
      assert.equal(e.message, 'File does not exist');
      done();
    });
  });

  it('should save tsv without warnings', (done) => {

    const mock = mocks['saveTsv']['valid'];

    request = interface.saveTsvIntoDB(mock, 1);

    request.then((r) => {
      assert.equal(r.status, "OK");
      assert.equal(r.warnings.length, 0);
      done();
    });

  });

  it('should save tsv with warnings - wrong field value', (done) => {

    const mock = mocks['saveTsv']['wrongField'];

    request = interface.saveTsvIntoDB(mock, 1);

    request.then((r) => {
      assert.equal(r.status, "OK");
      assert.notEqual(r.warnings.length, 0);
      assert.deepEqual(r.warnings, [`Field "I'm a wrong field" does not exist on orchard_dataset_contents's columns_dict`]);
      done();
    })
    .catch(e => console.log(e));

  });

  it('should save tsv with warnings - extra field', (done) => {

    const mock = mocks['saveTsv']['extraField'];

    request = interface.saveTsvIntoDB(mock, 1);

    request.then((r) => {
      assert.equal(r.status, "OK");
      assert.notEqual(r.warnings.length, 0);
      assert.deepEqual(r.warnings, [`Field "I'm An Extra Field" does not exist on orchard_dataset_contents's columns_dict`]);
      done();
    })
    .catch(e => console.log(e));

  });

  it('should not save tsv - tsv parser error', (done) => {

    const mock = mocks['saveTsv']['parserError'];

    request = interface.saveTsvIntoDB(mock, 1);

    request
      .catch(e => {

        assert.match(e.message,
          /Number of columns on line [0-9]* does not match header/gi, "match");
        done();

      });

  });

  it('should save log error into db', (done) => {

    const mock = mocks['logErrorIntoDB']['valid'];

    request = interface.logErrorIntoDB(1, mock);

    request
      .then(r => {

        assert.equal(r.status, 'OK')
        done();

      });

  });

  it('should not save log error into db - field is null', (done) => {

    const mock = mocks['logErrorIntoDB']['nullValue'];

    request = interface.logErrorIntoDB(1, mock);

    request
      .then(r => console.log(r))
      .catch(e => {

        assert.equal(e.thrower, `logErrorIntoDB`);
        assert.equal(e.error.name, `Error`);
        assert.match(e.error.message, /SQLITE_CONSTRAINT: NOT NULL constraint failed/i);
        done();

      });

  });

  it('should not save log error into db - null object', (done) => {

    const mock = mocks['logErrorIntoDB']['invalidObject'];

    request = interface.logErrorIntoDB(1, mock);

    request
    .catch(e => {

      assert.equal(e.name, `TypeError`);
      assert.equal(e.message, `Cannot read property 'row_id' of null`);
      done();

    });

  });

  it('should return database size', (done) => {

    const dataset = mocks['getDatasetSize']['dataset'];

    const data = dataset['source'];
    const size = dataset['size'];
    const _id = dataset['dataset_id'];

    interface.saveTsvIntoDB(data, _id)
      .then(() => interface.getDatasetSize(_id))
      .then(r => {

        console.log(r)
        assert.equal(r, size);
        done();

      })
      .catch(e => console.log(e));

  });


});
