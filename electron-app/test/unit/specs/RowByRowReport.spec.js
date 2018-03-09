import RowByRowReportPage from '@/components/pages/RowByRowReport'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import router from '@/router'
import {shallow} from 'avoriaz'
import sinon from 'sinon'
import Vuex from 'vuex'
import {
    SUBMISSIONS_FAILURE,
    SUBMISSIONS_REQUEST,
    SUBMISSION,
    ROW_BY_ROW_REPORT
} from '@/constants/types'

describe('RowByRowReport.vue', () => {
    let wrapper
    let store
    let getters
    let state
    let actions
    let $validRoute
    let $invalidRoute

    beforeEach(() => {
        getters = {
            // error: () => SUBMISSIONS_FAILURE,
            // loading: () => SUBMISSIONS_REQUEST,
            // items: () => SUBMISSION,
            rowByRowDownloadLink: function () { return function () { return 'link' } },
            [`${SUBMISSIONS_FAILURE}`]: () => [],
            [`${SUBMISSIONS_REQUEST}`]: () => ({}),
            [`${SUBMISSION}`]: () => ({status: 1, time: 1519789653})
        }

        state = { Reports: { [ROW_BY_ROW_REPORT]: [] } }

        actions = {fetchRowByRowReport: sinon.stub()}

        $validRoute = {
            name: 'RowByRowReport',
            params: {
                id: 123
            }
        }

        $invalidRoute = {
            name: 'RowByRowReport',
            params: {
            }
        }

        store = new Vuex.Store({
            getters,
            state,
            actions
        })

        wrapper = shallow(RowByRowReportPage, {
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

    it('should have a data property to map status messages', () => {
        wrapper = shallow(RowByRowReportPage, {
            router,
            store,
            globals: { $route: $validRoute }
        })

        expect(wrapper.vm.overallStatusMap).to.be.an('object')
    })

    it('should have a `ReportSummaryLabel` component', () => {
        expect(wrapper.contains(ReportSummaryLabel)).to.equal(true)
    })

    it('should trigger a vuex actions on init', () => {
        wrapper.update()

        expect(actions.fetchRowByRowReport.calledOnce).to.equal(true)
    })

    it('should NOT trigger a vuex actions on init if no id is passed in the $route', async () => {
        wrapper = shallow(RowByRowReportPage, {
            router,
            store,
            globals: { $route: $invalidRoute }
        })

        expect(actions.fetchRowByRowReport.calledOnce).to.equal(false)
    })

    it('should have the proper report title', () => {
        const title = wrapper.find('.report-summary__title')[0]

        expect(title.text().trim()).to.equal('Errors Per Row')
    })

})