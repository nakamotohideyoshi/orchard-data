import RowByRowReportPage from '@/components/pages/RowByRowReport'
import router from '@/router'
import { shallow } from 'avoriaz'
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

  beforeEach(() => {
    getters = {
      [`${SUBMISSIONS_FAILURE}`]: () => [],
      [`${SUBMISSIONS_REQUEST}`]: () => ({}),
      [`${SUBMISSION}`]: () => ({ status: 1, time: 1519789653 })
    }

    state = { Reports: { [ROW_BY_ROW_REPORT]: [] } }

    actions = { fetchRowByRowReport: sinon.stub() }

    $validRoute = {
      name: 'row-by-row',
      params: {
        id: 123
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

  /*
  We don't need these in here, it should be tested in the parent
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
  */

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
})
