const assert = require('chai').assert
const _ = require('lodash')

const filterId = 'filter16'

const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}`, function () {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should not report - valid names', () => {
    const mock = mocks['valid']
    const occurrences = filter(mock)

    assert.equal(_.isEmpty(occurrences), true)
  })

  it('should not report - valid spanish names', () => {
    const mock = mocks['validSpanish']
    const occurrences = filter(mock)

    assert.equal(_.isEmpty(occurrences), true)
  })

  it('should not report - valid portuguese names', () => {
    const mock = mocks['validPortuguese']
    const occurrences = filter(mock)

    assert.equal(_.isEmpty(occurrences), true)
  })

  it('should report - invalid occurrences', () => {
    const mock = mocks['invalid']

    const occurrences = filter(mock)
    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx + 1) {
        case 1:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['(You Make Me Feel Like a) Natural Woman'])
          break

        case 2:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['I Got The - single'])
          break

        case 3:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Me And You'])
          break

        case 4:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Me and YOu'])
          break

        case 5:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['YOUNG AMERICANS'])
          break

        case 6:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['the downward spiral'])
          break

        case 7:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['a TIMe to lOVE'])
          break

        case 8:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['I Got The - single'])
          break

        case 9:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['Me And You'])
          break

        case 10:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['Me and YOu'])
          break
      }
    })
  })

  it('should report - invalid spanish case', () => {
    const mock = mocks['invalidSpanish-wrongCase']

    const occurrences = filter(mock)
    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx + 1) {
        case 1:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Popurrí: Guitarras de media noche / ya no me quieres / Paloma querida (En directo)'])
          break
      }
    })
  })

  it('should report - inconsistent spanish case', () => {
    const mock = mocks['invalidSpanish-inconsistentCase']

    const occurrences = filter(mock)
    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx + 1) {
        case 1:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['Soy el Caso del Título'])
          break
      }
    })
  })

  it('should report - wrong and inconsistent spanish case', () => {
    const mock = mocks['invalidSpanish-wrongAndInconsistent']

    const occurrences = filter(mock)
    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx + 1) {
        case 1:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Popurrí: Guitarras de media noche / ya no me quieres / Paloma querida (En directo)'])
          break

        case 2:
          assert.deepEqual(occurrence.field, ['release_name', 'track_name'])
          assert.deepEqual(occurrence.value, ['Me encanta amar', 'Soy un caso de oraciones'])
          break

        case 3:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Me encanta amar'])
          break
      }
    })
  })

  it('should report - invalid portuguese case', () => {
    const mock = mocks['invalidPortuguese-wrongCase']

    const occurrences = filter(mock)
    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx + 1) {
        case 1:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Pot-pourri: Guitarras da meia noite / você não me quer / Paloma querida (Ao vivo)'])
          break
      }
    })
  })

  it('should report - inconsistent portuguese case', () => {
    const mock = mocks['invalidPortuguese-inconsistentCase']

    const occurrences = filter(mock)
    assert.equal(_.isEmpty(occurrences), false)

    occurrences.forEach((occurrence, idx) => {
      switch (idx + 1) {
        case 1:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['Este Não É'])
          break
      }
    })
  })
})
