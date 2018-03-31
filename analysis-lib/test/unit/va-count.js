const assert = require('chai').assert

const describe = require('mocha').describe
const it = require('mocha').it

const mocks = require(`../../mocks/va-count/va-count`)

const vaCount = require(`../../src/features/variousartistscount`)

describe(`should test Various Artists`, function () {
  this.timeout(10000)

  it('sheet1: Count: 0 VA, 100 rows, 0%.  (English, fully spelled out)', async () => {
    const mock = mocks['sheet1']
    const count = await vaCount(mock)
    assert.equal(count, 0)
  })

  it('sheet2: Count: 1 VA, 10 rows, 10%.  (English, fully spelled out)', async () => {
    const mock = mocks['sheet2']
    const count = await vaCount(mock)
    assert.equal(count, 0.1)
  })

  it('sheet3: Count: 71 VA, 2000 rows, 3.55%  (English, fully spelled out)', async () => {
    const mock = mocks['sheet3']
    const count = await vaCount(mock)
    assert.equal(count, 0.0355)
  })

  it('sheet4: 1st item is VA, last item is VA, count 2, 10 rows, 20%  (English, fully spelled out)', async () => {
    const mock = mocks['sheet4']
    const count = await vaCount(mock)
    assert.equal(count, 0.2)
  })

  it('sheet5: Portuguese only, 1 VA, 10 rows', async () => {
    const mock = mocks['sheet5']
    const count = await vaCount(mock)
    assert.equal(count, 0.1)
  })

  it('sheet6: Spanish only, 1 VA, 10 rows', async () => {
    const mock = mocks['sheet6']
    const count = await vaCount(mock)
    assert.equal(count, 0.1)
  })

  it('sheet7: Mixed English, Portuguese, Spanish, 3 VA, 10 rows', async () => {
    const mock = mocks['sheet7']
    const count = await vaCount(mock)
    assert.equal(count, 0.3)
  })
})
