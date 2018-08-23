const assert = require('chai').assert

const filterName = require('path').parse(__filename).name

const mocks = require(`../../../mocks/filters/${filterName}`)

const filter = require(`../../../src/filters/${filterName}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterName]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterName}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterName)

  it('Fail: If a tail contains both parentheses and square brackets, and square brackets are used before parens, it is an error.', () => {
    const mock = mocks.failBecauseTailContainsBothParenthesesAndSquareBracketsAndSquareBracketsAreUsedBeforeParens

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)
      assert.deepEqual(occurrence.field, ['track_name'])
      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.value, ['All of Me [Tiësto’s Birthday Treatment Remix] (Radio Edit)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('Pass: tail contains both parentheses and square brackets, and square brackets are used before parens', () => {
    const mock = mocks.passBecauseTailContainsBothParenthesesAndSquareBracketsAndParensAreUsedBeforeSquareBrackets

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)

      assert.equal(occurrence, false)
    })
  })

  it('Fail: If a tail contains both parentheses and square brackets, and there is more than one set of parenthesis, it is an error.', () => {
    const mock = mocks.failBecauseTailContainsBothParenthesesAndSquareBracketsAndThereIsMoreThanOneSetOfParenthesis

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)
      assert.deepEqual(occurrence.field, ['track_name'])
      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.value, ['All of Me (Tiësto’s Birthday Treatment Remix) (Radio Edit)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('Pass: first set of parenthesis are not in the tail', () => {
    const mock = mocks.passBecauseFirstSetOfParenthesisAreNotInTheTail

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)

      assert.equal(occurrence, false)
    })
  })

  it('Pass: first set of brackets are not in the tail', () => {
    const mock = mocks.passBecauseFirstSetOfBracketsAreNotInTheTail

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)

      assert.equal(occurrence, false)
    })
  })

  it('Pass: If a tail contains both parentheses and square brackets, and there is more than one set of square brackets, it is not an error.', () => {
    const mock = mocks.passBecauseTailContainsBothParenthesesAndSquareBracketsAndThereIsMoreThanOneSetOfSquareBrackets

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)

      assert.equal(occurrence, false)
    })
  })

  it('Fail: If a tail contains multiple explanatory references and the first one is in square brackets rather than parentheses, it is an error.', () => {
    const mock = mocks.failBecauseTailContainsMultipleExplanatoryReferencesAndTheFirstOneIsInSquareBracketsRatherThanParentheses

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)
      assert.deepEqual(occurrence.field, ['track_name'])
      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.value, ['All of Me [Tiësto’s Birthday Treatment Remix] [Radio Edit]'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })
})
