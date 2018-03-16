const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = 'filter17'
const mocks = require(`../../../mocks/filters/filter17`)
const filter = require(`../../../src/filters/filter17`)
const filterMeta = require('../../../src/filters/filters-meta').filter17

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should pass: genre and sub-genre have a case-sensitive match with a "GENRE AS SHOWN ON THE STORE" value', () => {
    mocks.caseSensitiveMatchGenreName.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should pass: genre and sub-genre have case-INsensitive matches with a "GENRE AS SHOWN ON THE STORE" value', () => {
    mocks.caseInsensitiveMatchGenreName.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should pass: genre and sub-genre have case-sensitive matches with a "GENRE CODE FOR METADATA" value', () => {
    mocks.caseSensitiveMatchGenreCode.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should pass: genre and sub-genre have case-INsensitive matches with a "GENRE CODE FOR METADATA" value', () => {
    mocks.caseInsensitiveMatchGenreCode.forEach((item, index) => {
      let occurrence = filter(item, index)
      assert.equal(occurrence, false)
    })
  })

  it('should fail: genre matches with a path under "Music Videos"', () => {
    mocks.MatchMusicVideoPath.forEach((item, index) => {
      let occurrence = filter(item, index)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['genre'])
          assert.deepEqual(occurrence.value, ['Music Videos'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        case 1:
          assert.deepEqual(occurrence.field, ['genre', 'sub_genre'])
          assert.deepEqual(occurrence.value, ['Music Videos', 'Music Videos'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType])
          break
      }
    })
  })

  it('should fail: genre matches with a path under "Ringtones"', () => {
    mocks.MatchRingtonePath.forEach((item, index) => {
      let occurrence = filter(item, index)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['genre'])
          assert.deepEqual(occurrence.value, ['Ringtones'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
        case 1:
          assert.deepEqual(occurrence.field, ['genre', 'sub_genre'])
          assert.deepEqual(occurrence.value, ['Ringtones', 'Ringtones'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId, defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType, defaultErrorType])
          break
      }
    })
  })

  it('should fail: genre does not match any item in canonical list', () => {
    mocks.GenreDoesNotMatchAnyItem.forEach((item, index) => {
      let occurrence = filter(item, index)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['genre'])
          assert.deepEqual(occurrence.value, ['Nop'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should fail: sub-genre does not match any item in canonical list', () => {
    mocks.SubGenreDoesNotMatchAnyItem.forEach((item, index) => {
      let occurrence = filter(item, index)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['sub_genre'])
          assert.deepEqual(occurrence.value, ['Nop'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should fail: genre is blank', () => {
    mocks.GenreIsBlank.forEach((item, index) => {
      let occurrence = filter(item, index)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['genre'])
          assert.deepEqual(occurrence.value, [''])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should fail: sub-genre is blank', () => {
    mocks.SubGenreIsBlank.forEach((item, index) => {
      let occurrence = filter(item, index)

      switch (index) {
        case 0:
          assert.deepEqual(occurrence.field, ['sub_genre'])
          assert.deepEqual(occurrence.value, [''])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })
})
