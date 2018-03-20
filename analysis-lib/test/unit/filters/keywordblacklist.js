const assert = require('chai').assert

const filterId = 'keywordblacklist'

const mocks = require(`../../../mocks/filters/${filterId}`)

const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}`, function () {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)
  this.timeout(10000)

  it('should fail: test case-sensitive search for (abcd)', async () => {
    const mock = mocks['caseSensitiveSearch']['dataset']
    const metadata = mocks['caseSensitiveSearch']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['abcd'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should fail: test case-inSensitive search for (ABCD)', async () => {
    const mock = mocks['caseInSensitiveSearch']['dataset']
    const metadata = mocks['caseInSensitiveSearch']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['ABCD'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    };
  })

  it('should fail: first word in keyword blacklist is checked', async () => {
    const mock = mocks['firstInKeywrodblacklist']['dataset']
    const metadata = mocks['firstInKeywrodblacklist']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['second'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should fail: last word in keyword blacklist is checked', async () => {
    const mock = mocks['lastInKeywrodblacklist']['dataset']
    const metadata = mocks['lastInKeywrodblacklist']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['third'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should fail: release name is checked', async () => {
    const mock = mocks['releaseNameMatch']['dataset']
    const metadata = mocks['releaseNameMatch']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['release-name-match'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should fail: track name is checked', async () => {
    const mock = mocks['trackNameMatch']['dataset']
    const metadata = mocks['trackNameMatch']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['track-name-match'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should fail: substring match', async () => {
    const mock = mocks['subStringMatch']['dataset']
    const metadata = mocks['subStringMatch']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Tender I-AM-THE-SUBSTRING Hooks'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should fail: track name is checked', async () => {
    const mock = mocks['exactMatch']['dataset']
    const metadata = mocks['exactMatch']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)

      switch (occurrence.row_id) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['I-AM-THE-SUBSTRING'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    }
  })

  it('should pass:', async () => {
    const mock = mocks['valid']['dataset']
    const metadata = mocks['valid']['metadata']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, metadata)
      assert.equal(occurrence, false)
    }
  })
})
