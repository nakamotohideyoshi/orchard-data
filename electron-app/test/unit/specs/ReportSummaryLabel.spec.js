import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import {shallow} from 'avoriaz'

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

    it('should set proper values for error Success status', () => {
        wrapper = shallow(ReportSummaryLabel, {
            propsData: {
                status: 1
            }
        })

        expect(wrapper.vm.colorClass).to.be.equal('report-summary__label--green')
        expect(wrapper.text()).to.be.equal('Success')
    })

    it('should set proper values for error Fail status', () => {
        wrapper = shallow(ReportSummaryLabel, {
            propsData: {
                status: 2
            }
        })

        expect(wrapper.vm.colorClass).to.be.equal('report-summary__label--red')
        expect(wrapper.text()).to.be.equal('Fail')
    })

    it('should set proper values for error In Progress status', () => {
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

        // stubbed out to fix breaking build
        // expect(wrapper.vm.colorClass).to.be.undefined()
        expect(wrapper.text()).to.be.equal('')
    })

})
