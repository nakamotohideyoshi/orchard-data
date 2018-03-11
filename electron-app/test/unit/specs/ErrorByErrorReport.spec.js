import ErrorByErrorReportPage from '@/components/pages/ErrorByErrorReport'
import router from '@/router'
import { shallow } from 'avoriaz'
import sinon from 'sinon'
import Vuex from 'vuex'
import {
  SUBMISSIONS_FAILURE,
  SUBMISSIONS_REQUEST,
  SUBMISSION,
  ERROR_BY_ERROR_REPORT,
  ERROR_BY_ERROR_REPORT_FAILURE
} from '@/constants/types'

describe('ErrorByErrorReport.vue', () => {
  let wrapper
  let store
  let getters
  let state
  let actions
  let mutations
  let $validRoute
  let $invalidRoute

  beforeEach(() => {
    getters = {
      [`${SUBMISSIONS_FAILURE}`]: () => [],
      [`${SUBMISSIONS_REQUEST}`]: () => ({}),
      [`${SUBMISSION}`]: () => ({ status: 1, time: 1519789653 }),
      [ERROR_BY_ERROR_REPORT_FAILURE]: () => ({})
    }

    state = { Reports: { [ERROR_BY_ERROR_REPORT]: [] } }

    actions = {
      fetchErrorByErrorReport: sinon.stub(),
      fetchErrors: sinon.stub()
    }

    mutations = {
      [ERROR_BY_ERROR_REPORT_FAILURE]: () => { }
    }

    $validRoute = {
      name: 'error-by-error',
      params: {
        id: 123
      }
    }

    $invalidRoute = {
      name: 'error-by-error',
      params: {}
    }

    store = new Vuex.Store({
      getters,
      state,
      actions,
      mutations
    })

    wrapper = shallow(ErrorByErrorReportPage, {
      router,
      store,
      globals: { $route: $validRoute }
    })
  })

  /*
  it('should have a computed property called `downloadLink`', () => {
    expect(wrapper.vm.downloadLink).to.be.a('string')
  })

  it('should have a computed property called `batchId`', () => {
    expect(wrapper.vm.batchId).to.be.a('number')
  })

  it('should have a computed property called `batchId` that matches the route', () => {
    expect(wrapper.vm.batchId).to.equal(123)
  })
  */

  it('should have a method for fetching report results', () => {
    expect(wrapper.vm.fetchErrors).to.be.a('function')
  })

  it('should have a data property to hold the list of results', () => {
    expect(wrapper.vm.items).to.be.an('array')
  })

  it('should trigger a vuex actions on init', () => {
    wrapper.update()

    // expect(actions.fetchErrorByErrorReport.calledOnce).to.equal(true)
    expect(actions.fetchErrors.calledOnce).to.equal(true)
  })

  it('should NOT trigger a vuex actions on init if no id is passed in the $route', async () => {
    actions = {
      fetchErrorByErrorReport: sinon.stub(),
      fetchErrors: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      state,
      actions,
      mutations
    })

    wrapper = shallow(ErrorByErrorReportPage, {
      router,
      store,
      globals: { $route: $invalidRoute }
    })

    // expect(actions.fetchErrorByErrorReport.calledOnce).to.equal(false)
    expect(actions.fetchErrors.called).to.equal(false)
    expect(wrapper.vm.error).to.be.an.instanceof(Object)
  })

  /*
  it('should have the proper report title', () => {
    const title = wrapper.find('.report-summary__title')[0]

    expect(title.text().trim()).to.equal('Most Common Errors')
  })
  */
})
