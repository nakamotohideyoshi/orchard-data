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
  ERROR_BY_ERROR_REPORT_FAILURE,
  FILTERS_META
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
      [ERROR_BY_ERROR_REPORT_FAILURE]: () => ({}),
      [FILTERS_META]: () => ({
        filter123: {
          userExplanation: 'stubbed out filter'
        }
      })
    }

    state = {
      Reports: {
        [ERROR_BY_ERROR_REPORT]: [{criteriaId: 'filter2', count: 10}, {criteriaId: 'filter1', count: 0}, {criteriaId: 'filter3', count: 15}]
      }
    }

    actions = {
      fetchErrorByErrorReport: sinon.stub()
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

  it('should have a method for fetching report results', () => {
    expect(wrapper.vm.fetchErrorByErrorReport).to.be.a('function')
  })

  it('should have a data property to hold the list of results', () => {
    expect(wrapper.vm.items).to.be.an('array')
  })

  it('should trigger a vuex actions on init', () => {
    expect(actions.fetchErrorByErrorReport.called).to.be.true
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

    expect(actions.fetchErrorByErrorReport.called).to.equal(false)
    expect(wrapper.vm.error).to.be.an.instanceof(Object)
  })

  it('`getFilter()` should return the value of the matching ID', () => {
    const value = wrapper.vm.getFilter('filter123')

    expect(value).to.equal('stubbed out filter')
  })

  it('`getFilter()` should still return a value even if an ID is not passed in', () => {
    const value = wrapper.vm.getFilter()

    expect(value).to.equal('N/A')
  })

  it('`getFilter()` should still return a value even if an invalid ID is passed in', () => {
    const value = wrapper.vm.getFilter(123)

    expect(value).to.equal('N/A')
  })

  it('should sort `item` in acceding order when `sort.count` is not "desc"', () => {
    wrapper.vm.sort.count = 'asc'
    const sortedItems = wrapper.vm.items

    expect(sortedItems[0].criteriaId).to.equal('filter1')
    expect(sortedItems[1].criteriaId).to.equal('filter2')
    expect(sortedItems[2].criteriaId).to.equal('filter3')
  })

  it('should sort `item` in descending order bye default', () => {
    const sortedItems = wrapper.vm.items

    expect(sortedItems[0].criteriaId).to.equal('filter3')
    expect(sortedItems[1].criteriaId).to.equal('filter2')
    expect(sortedItems[2].criteriaId).to.equal('filter1')
  })

  it('`toggleSort()` will toggle the sort direction of the name passed in', () => {
    expect(wrapper.vm.sort.count).to.equal('desc')
    wrapper.vm.toggleSort('count')
    expect(wrapper.vm.sort.count).to.equal('asc')
    wrapper.vm.toggleSort('count')
    expect(wrapper.vm.sort.count).to.equal('desc')
  })
})
