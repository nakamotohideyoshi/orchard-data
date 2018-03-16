'use strict'

const assert = require('chai').assert
const _ = require('lodash')

const DbInterface = require('../../src/db-scripts/db-interface')

const mocks = require('../../mocks/db-interface/db-interface')

describe('should test database interface utilities', function () {
  let _interface
  let request

  this.timeout(10000)

  before(() => {
    _interface = new DbInterface()
    _interface.init()
  })

  it('should test the initialized interface', () => {
    assert.typeOf(_interface.dbStatus, 'object')
    assert.equal(_interface.dbStatus.OK, 1)
    assert.equal(_interface.dbStatus.FAIL, 2)
    assert.equal(_interface.dbStatus.INPROGRESS, 3)
  })

  it('should create metadata', (done) => {
    const mock = mocks['metadata']['valid']

    request = _interface.saveDatasetMeta(mock)

    request.then((r) => {
      assert.equal(_.isObject(r), true)
      assert.equal(!_.isNaN(r.datasetId), true)
      done()
    })
  })

  it('should fail to create metadata', (done) => {
    const mock = mocks['metadata']['invalid']

    request = _interface.saveDatasetMeta(mock)

    request.then((r) => {
      assert.equal(r.stmt.changes, -1)
      done()
    })
      .catch((e) => {
        assert.equal(e.message, 'File does not exist')
        done()
      })
  })

  it('should save tsv without warnings', (done) => {
    const mock = mocks['saveTsv']['valid']

    request = _interface.saveTsvIntoDB(mock, 1)

    request.then((r) => {
      assert.equal(r.status, 'OK')
      assert.equal(r.warnings.length, 0)
      done()
    })
  })

  it('should save tsv with warnings - wrong field value', (done) => {
    const mock = mocks['saveTsv']['wrongField']

    request = _interface.saveTsvIntoDB(mock, 1)

    request.then((r) => {
      assert.equal(r.status, 'OK')
      assert.notEqual(r.warnings.length, 0)
      assert.deepEqual(r.warnings, [`Field "I'm a wrong field" does not exist on orchard_dataset_contents's columns_dict`])
      done()
    })
      .catch(e => console.log(e))
  })

  it('should save tsv with warnings - extra field', (done) => {
    const mock = mocks['saveTsv']['extraField']

    request = _interface.saveTsvIntoDB(mock, 1)

    request.then((r) => {
      assert.equal(r.status, 'OK')
      assert.notEqual(r.warnings.length, 0)
      assert.deepEqual(r.warnings, [`Field "I'm An Extra Field" does not exist on orchard_dataset_contents's columns_dict`])
      done()
    })
      .catch(e => console.log(e))
  })

  it('should not save tsv - tsv parser error', (done) => {
    const mock = mocks['saveTsv']['parserError']

    request = _interface.saveTsvIntoDB(mock, 1)

    request
      .catch(e => {
        assert.match(e.message,
          /Number of columns on line [0-9]* does not match header/gi, 'match')
        done()
      })
  })

  it('should save log error into db', (done) => {
    const mock = mocks['logErrorIntoDB']['valid']

    request = _interface.logErrorIntoDB(1, mock)

    request
      .then(r => {
        assert.equal(r.status, 'OK')
        done()
      })
  })

  it('should not save log error into db - field is null', (done) => {
    const mock = mocks['logErrorIntoDB']['nullValue']

    request = _interface.logErrorIntoDB(1, mock)

    request
      .catch(e => {
        assert.equal(e.name, `Error`)
        assert.match(e.message, /SQLITE_CONSTRAINT: NOT NULL constraint failed/i)
        done()
      })
  })

  it('should not save log error into db - null object', (done) => {
    const mock = mocks['logErrorIntoDB']['invalidObject']

    request = _interface.logErrorIntoDB(1, mock)

    request
      .catch(e => {
        assert.equal(e.name, `TypeError`)
        assert.equal(e.message, `Cannot read property 'row_id' of null`)
        done()
      })
  })

  /*
  it('should return database size', (done) => {

    const dataset = mocks['getDatasetSize']['dataset'];

    const data = dataset['source'];
    const size = dataset['size'];
    const _id = dataset['dataset_id'];

    _interface.saveTsvIntoDB(data, _id)
      .then(() => _interface.getDatasetSize(_id))
      .then(r => {

        assert.equal(r, size);
        done();

      })
      .catch(e => console.log(e));

  });
  */
})
