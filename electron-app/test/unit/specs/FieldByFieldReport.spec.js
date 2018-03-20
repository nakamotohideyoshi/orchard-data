import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import FieldByFieldReport from '@/components/pages/FieldByFieldReport'
import { FIELDS, FIELDS_FAILURE, FILTERS_META, FIELD_BY_FIELD_REPORT, FIELDS_REQUEST, SUBMISSION } from '@/constants/types'
import module from '../../../src/renderer/store/modules/Submissions'
import router from '../../../src/renderer/router'

describe('FieldByFieldReport.vue', () => {
  let wrapper
  let store
  let getters
  let actions
  let $validRoute
  let $invalidRoute
  let state
  let $modal
  // const noDataSetErrorMessage = 'No dataset ID defined'

  beforeEach(() => {
    getters = {
      [SUBMISSION]: () => ({ status: 1, time: 1519789653 }),
      [FIELDS]: () => [],
      [FIELDS_FAILURE]: () => ({}),
      [FILTERS_META]: () => ({
        filter123: {
          userExplanation: 'stubbed out filter'
        }
      }),
      [FIELDS_REQUEST]: () => false
    }

    actions = {
      fetchFieldByFieldReport: sinon.stub()
    }

    state = { Reports: { [FIELD_BY_FIELD_REPORT]: [] } }

    store = new Vuex.Store({
      getters,
      mutations: { ...module.mutations },
      actions,
      state
    })

    $validRoute = {
      name: 'FieldByFieldReport',
      params: {
        id: 1
      }
    }

    $invalidRoute = {
      name: 'FieldByFieldReport',
      params: {}
    }

    $modal = {
      show: sinon.stub(),
      hide: sinon.stub()
    }

    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      globals: {
        $route: $validRoute,
        $modal
      }
    })
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.show).to.equal('function')
    expect(typeof wrapper.vm.hide).to.equal('function')
    expect(typeof wrapper.vm.getFilter).to.equal('function')
    expect(typeof wrapper.vm.fetchFieldByFieldReport).to.equal('function')
  })

  it('should verify vuex actions were executed on init', () => {
    expect(actions.fetchFieldByFieldReport.calledOnce).to.equal(true)
  })

  it('should NOT execute vuex actions on init if no id is passed in the $route', async () => {
    actions = {
      fetchFieldByFieldReport: sinon.stub()
    }
    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      getters,
      globals: { $route: $invalidRoute }
    })

    expect(actions.fetchFieldByFieldReport.calledOnce).to.equal(false)
    expect(wrapper.vm.error).to.be.an.instanceof(Object)
  })

  it('should show a modal when `show()` is called', () => {
    wrapper.vm.show()

    expect(wrapper.vm.$modal.show.calledOnce).to.be.true
    expect(wrapper.vm.$modal.show.calledWith('field-modal')).to.be.true
  })

  it('should show a modal when `hide()` is called', () => {
    wrapper.vm.hide()

    expect(wrapper.vm.$modal.hide.calledOnce).to.be.true
    expect(wrapper.vm.$modal.hide.calledWith('field-modal')).to.be.true
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

  // TODO: Assert layout
  //       * Check rendered table with valid items
  //       * Check rendered table with invalid items
  //       * Check rendered table with no items
})
