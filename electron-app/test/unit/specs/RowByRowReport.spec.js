import RowByRowReportPage from '@/components/pages/RowByRowReport'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import router from '@/router'
import {shallow} from 'avoriaz'
import Vuex from 'vuex'
import {SUBMISSIONS_FAILURE, SUBMISSIONS_REQUEST, SUBMISSION} from '@/constants/types'

describe('RowByRowReport.vue', () => {
    let wrapper
    let store
    let getters
    let $validRoute

    beforeEach(() => {
        getters = {
            // error: () => SUBMISSIONS_FAILURE,
            // loading: () => SUBMISSIONS_REQUEST,
            // items: () => SUBMISSION,
            [`${SUBMISSIONS_FAILURE}`]: () => [],
            [`${SUBMISSIONS_REQUEST}`]: () => ({}),
            [`${SUBMISSION}`]: () => ({status: 1, time: 1519789653})
        }

        $validRoute = {
            name: 'RowByRowReport',
            params: {
                id: 123
            }
        }

        store = new Vuex.Store({
            getters
        })

        wrapper = shallow(RowByRowReportPage, {
            router,
            store,
            globals: { $route: $validRoute }
        })
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


})