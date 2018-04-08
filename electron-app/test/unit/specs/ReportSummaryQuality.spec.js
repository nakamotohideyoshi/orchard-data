import ReportSummaryQuality from '@/components/sections/ReportSummaryQuality'
import { shallow } from 'avoriaz'

describe('ReportSummaryQuality.vue', () => {
  let wrapper
  let reportSummary

  beforeEach(() => {
    reportSummary = {
      error_percent: 1
    }

    wrapper = shallow(ReportSummaryQuality, {
      propsData: {
        reportSummary
      }
    })
  })

  it('should have a prop called `reportSummary`', () => {
    expect(wrapper.vm.reportSummary).to.be.a('object')
  })

  it('should have a computed property for calculating the percentage', () => {
    expect(wrapper.vm.percentage).to.be.a('string')
  })

  it('should have a computed property to calculate the number of filled stars', () => {
    expect(wrapper.vm.filledStars).to.be.a('number')
  })

  it('should have a computed property to calculate the number of empty stars', () => {
    expect(wrapper.vm.emptyStarts).to.be.a('number')
  })

  it('should show no empty starts when 100%', () => {
    expect(wrapper.vm.percentage).to.equal('100.00')
    expect(wrapper.vm.emptyStarts).to.equal(4)
    expect(wrapper.vm.filledStars).to.equal(0)
  })

  it('should show 0 filled starts if there is no `error_percent` property present', () => {
    reportSummary = {}

    wrapper = shallow(ReportSummaryQuality, {
      propsData: {
        reportSummary
      }
    })

    expect(wrapper.vm.emptyStarts).to.equal(4)
    expect(wrapper.vm.filledStars).to.equal(0)
  })

  it('should show 2 full stars when 50%', () => {
    reportSummary = {
      error_percent: 0.5,
      error_stars: 2
    }

    wrapper = shallow(ReportSummaryQuality, {
      propsData: {
        reportSummary
      }
    })

    expect(wrapper.vm.percentage).to.equal('50.00')
    expect(wrapper.vm.emptyStarts).to.equal(2)
    expect(wrapper.vm.filledStars).to.equal(2)
  })

  it('should show no full stars when 0%', () => {
    reportSummary = {
      error_percent: 0,
      error_stars: 4
    }

    wrapper = shallow(ReportSummaryQuality, {
      propsData: {
        reportSummary
      }
    })

    expect(wrapper.vm.percentage).to.equal('0.00')
    expect(wrapper.vm.emptyStarts).to.equal(0)
    expect(wrapper.vm.filledStars).to.equal(4)
  })
})
