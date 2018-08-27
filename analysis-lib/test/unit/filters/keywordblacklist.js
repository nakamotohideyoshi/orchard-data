const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = require('path').parse(__filename).name
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should fail: test case-sensitive search for (abcd)', async () => {
    const mock = mocks.caseSensitiveSearch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['abcd'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: test case-inSensitive search for (ABCD)', async () => {
    const mock = mocks.caseInSensitiveSearch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['ABCD'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: first word in keyword blacklist is checked', async () => {
    const mock = mocks.firstInKeywordBlacklist
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['second'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: last word in keyword blacklist is checked', async () => {
    const mock = mocks.lastInKeywordBlacklist
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['third'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: release name is checked', async () => {
    const mock = mocks.releaseNameMatch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['release-name-match'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: track name is checked', async () => {
    const mock = mocks.trackNameMatch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['track_name'])
      assert.deepEqual(occurrence.value, ['track-name-match'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: substring match', async () => {
    const mock = mocks.subStringMatch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['Tender I-AM-THE-SUBSTRING Hooks'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should fail: track name is checked', async () => {
    const mock = mocks.exactMatch
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    occurrences.forEach((occurrence) => {
      assert.deepEqual(occurrence.field, ['release_name'])
      assert.deepEqual(occurrence.value, ['I-AM-THE-SUBSTRING'])
      assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
      assert.deepEqual(occurrence.error_type, [defaultErrorType])
    })
  })

  it('should pass:', async () => {
    const mock = mocks.valid
    const { dataset, metadata } = mock
    const occurrences = filter(dataset, metadata)
    assert.equal(occurrences.length, 0)
  })
})
