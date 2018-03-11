import ErrorByErrorReportPage from '@/components/pages/ErrorByErrorReport'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import router from '@/router'
import { shallow } from 'avoriaz'
import sinon from 'sinon'
import Vuex from 'vuex'
import { SUBMISSIONS_FAILURE, SUBMISSIONS_REQUEST, SUBMISSION, ERROR_BY_ERROR_REPORT } from '@/constants/types'

describe('ErrorByErrorReport.vue', () => {
    let wrapper
    let store
    let getters
    let state
    let actions
    let $validRoute
    let $invalidRoute

    beforeEach(() => {
        getters = {
            errorByErrorDownloadLink: function () { return function () { return 'link' } },
            [`${SUBMISSIONS_FAILURE}`]: () => [],
            [`${SUBMISSIONS_REQUEST}`]: () => ({}),
            [`${SUBMISSION}`]: () => ({ status: 1, time: 1519789653 })
        }

        state = { Reports: { [ERROR_BY_ERROR_REPORT]: [] } }

        actions = { fetchErrorByErrorReport: sinon.stub() }

        $validRoute = {
            name: 'ErrorByErrorReport',
            params: {
                id: 123
            }
        }

        $invalidRoute = {
            name: 'ErrorByErrorReport',
            params: {}
        }

        store = new Vuex.Store({
            getters,
            state,
            actions
        })

        wrapper = shallow(ErrorByErrorReportPage, {
            router,
            store,
            globals: { $route: $validRoute }
        })
    })

    it('should have a computed property called `downloadLink`', () => {
        expect(wrapper.vm.downloadLink).to.be.a('string')
    })
    it('should have a computed property called `batchId`', () => {
        expect(wrapper.vm.batchId).to.be.a('number')
    })

    it('should have a computed property called `batchId` that matches the route', () => {
        expect(wrapper.vm.batchId).to.equal(123)
    })

    it('should have a computed property called `formattedDate`', () => {
        expect(wrapper.vm.formattedDate).to.be.a('string')
    })

    it('should have a method for fetching report results', () => {
        expect(wrapper.vm.fetchReport).to.be.a('function')
    })

    it('should have a data property to hold the list of results', () => {
        expect(wrapper.vm.results).to.be.an('array')
    })

    it('should have a `ReportSummaryLabel` component', () => {
        expect(wrapper.contains(ReportSummaryLabel)).to.equal(true)
    })

    it('should trigger a vuex actions on init', () => {
        wrapper.update()

        expect(actions.fetchErrorByErrorReport.calledOnce).to.equal(true)
    })

    it('should NOT trigger a vuex actions on init if no id is passed in the $route', async () => {
        wrapper = shallow(ErrorByErrorReportPage, {
            router,
            store,
            globals: { $route: $invalidRoute }
        })

        expect(actions.fetchErrorByErrorReport.calledOnce).to.equal(false)
    })

    it('should have the proper report title', () => {
        const title = wrapper.find('.report-summary__title')[0]

        expect(title.text().trim()).to.equal('Most Common Errors')
    })
})
