import ReportSummaryLabel from '@/components/sections/ReportSummaryLabel'
import { shallow } from 'avoriaz'

describe('ReportSummaryLabel.vue', () => {
  let wrapper

  it('should have a prop called `status`', () => {
    wrapper = shallow(ReportSummaryLabel, {
      propsData: {
        status: 1
      }
    })

    expect(wrapper.getProp('status')).to.be.a('number')
    expect(wrapper.getProp('status')).to.equal(1)
  })

  it('should have a computed property called `colorClass`', () => {
    wrapper = shallow(ReportSummaryLabel, {
      propsData: {
        status: 1
      }
    })

    expect(wrapper.vm.colorClass).to.be.a('string')
  })

  it('should set proper values for Success status', () => {
    wrapper = shallow(ReportSummaryLabel, {
      propsData: {
        status: 1
      }
    })

    expect(wrapper.vm.colorClass).to.be.equal('report-summary__label--hidden')
  })

  it('should set proper values for Fail status', () => {
    wrapper = shallow(ReportSummaryLabel, {
      propsData: {
        status: 2
      }
    })

    expect(wrapper.vm.colorClass).to.be.equal('report-summary__label--red')
    expect(wrapper.text()).to.be.equal('Fail')
  })

  it('should set proper values for In Progress status', () => {
    wrapper = shallow(ReportSummaryLabel, {
      propsData: {
        status: 3
      }
    })

    expect(wrapper.vm.colorClass).to.be.equal('report-summary__label--yellow')
    expect(wrapper.text()).to.be.equal('In Progress')
  })

  it('should not display anything if the error-value is passed in', () => {
    wrapper = shallow(ReportSummaryLabel, {
      propsData: {
        status: -1
      }
    })
    expect(wrapper.vm.colorClass).to.equal(undefined)
    expect(wrapper.text()).to.be.equal('')
  })
})
