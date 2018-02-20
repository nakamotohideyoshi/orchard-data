const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');
const dbInterface = require('../../src/db-scripts/db-interface');
const mocks = require('../../mocks/metadata');

describe('should test database interface utilities', () => {
  let interface;
  let filePath;
  let id;
  let request;
  
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
    const { valid } = mocks;
    request = interface.saveDatasetMeta(valid);

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
    const { invalid } = mocks;
    request = interface.saveDatasetMeta(invalid);

    request.then((r) => {
      assert.equal(r.stmt.changes, -1);
      done();
    })
    .catch((e) => {
      assert.equal(e.message, 'File does not exist');
      done();
    });
  });
});